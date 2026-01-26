import { VisaType } from '@lib/domain'
import {
  QualificationsSchema,
  encodeQualifications,
  decodeQualifications,
  isStateVersionOutdated,
} from '@lib/domain/qualifications'
import { CALCULATOR_STATE_VERSION } from '@lib/domain/constants'

// Mock crypto.randomUUID for tests
const mockUUID = 'test-uuid-1234-5678-90ab-cdef12345678'
beforeAll(() => {
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: () => mockUUID,
    },
  })
})

describe('state versioning', () => {
  const baseQualifications = {
    v: VisaType.Engineer,
    completed: 0,
    s: 'test-session-id', // Provide session ID to avoid randomUUID calls in most tests
  }

  describe('encodeQualifications', () => {
    it('should include the current state version when encoding', () => {
      const qualifications = QualificationsSchema.parse(baseQualifications)
      const encoded = encodeQualifications(qualifications)
      const decoded = JSON.parse(atob(encoded))

      expect(decoded._v).toBe(CALCULATOR_STATE_VERSION)
    })

    it('should always set version to current version, even if different version exists', () => {
      const qualifications = QualificationsSchema.parse({
        ...baseQualifications,
        _v: 0, // Old version
      })
      const encoded = encodeQualifications(qualifications)
      const decoded = JSON.parse(atob(encoded))

      expect(decoded._v).toBe(CALCULATOR_STATE_VERSION)
    })

    it('should preserve other fields when encoding', () => {
      const qualifications = QualificationsSchema.parse({
        ...baseQualifications,
        salary: 10000000,
        age: 30,
      })
      const encoded = encodeQualifications(qualifications)
      const decoded = JSON.parse(atob(encoded))

      expect(decoded.v).toBe(VisaType.Engineer)
      expect(decoded.salary).toBe(10000000)
      expect(decoded.age).toBe(30)
    })

    it('should generate a session ID if not present', () => {
      const qualifications = QualificationsSchema.parse({
        v: VisaType.Engineer,
        completed: 0,
        // No session ID provided
      })
      const encoded = encodeQualifications(qualifications)
      const decoded = JSON.parse(atob(encoded))

      expect(decoded.s).toBe(mockUUID)
    })

    it('should preserve existing session ID', () => {
      const sessionId = 'test-session-id-123'
      const qualifications = QualificationsSchema.parse({
        ...baseQualifications,
        s: sessionId,
      })
      const encoded = encodeQualifications(qualifications)
      const decoded = JSON.parse(atob(encoded))

      expect(decoded.s).toBe(sessionId)
    })
  })

  describe('decodeQualifications', () => {
    it('should correctly decode state with version', () => {
      const state = { v: VisaType.Engineer, completed: 0, _v: 1 }
      const encoded = btoa(JSON.stringify(state))
      const decoded = decodeQualifications(encoded)

      expect(decoded._v).toBe(1)
    })

    it('should handle state without version (legacy states)', () => {
      const state = { v: VisaType.Engineer, completed: 0 }
      const encoded = btoa(JSON.stringify(state))
      const decoded = decodeQualifications(encoded)

      expect(decoded._v).toBeUndefined()
    })

    it('should throw on invalid JSON', () => {
      const invalidEncoded = btoa('not valid json')
      expect(() => decodeQualifications(invalidEncoded)).toThrow()
    })

    it('should throw on invalid qualifications structure', () => {
      const invalidState = { invalid: 'structure' }
      const encoded = btoa(JSON.stringify(invalidState))
      expect(() => decodeQualifications(encoded)).toThrow()
    })
  })

  describe('isStateVersionOutdated', () => {
    it('should return false when version matches current version', () => {
      const qualifications = QualificationsSchema.parse({
        ...baseQualifications,
        _v: CALCULATOR_STATE_VERSION,
      })

      expect(isStateVersionOutdated(qualifications)).toBe(false)
    })

    it('should return true when version is older than current', () => {
      const qualifications = QualificationsSchema.parse({
        ...baseQualifications,
        _v: 0,
      })

      expect(isStateVersionOutdated(qualifications)).toBe(true)
    })

    it('should return true when version is missing (legacy state)', () => {
      const qualifications = QualificationsSchema.parse(baseQualifications)

      expect(isStateVersionOutdated(qualifications)).toBe(true)
    })

    it('should return true when version is newer than current (future-proofing)', () => {
      const qualifications = QualificationsSchema.parse({
        ...baseQualifications,
        _v: CALCULATOR_STATE_VERSION + 1,
      })

      expect(isStateVersionOutdated(qualifications)).toBe(true)
    })
  })

  describe('roundtrip encoding/decoding', () => {
    it('should preserve all fields through encode/decode cycle', () => {
      const original = QualificationsSchema.parse({
        v: VisaType.Engineer,
        completed: 15,
        salary: 8000000,
        age: 32,
        degree: 'master',
        s: 'session-123',
      })

      const encoded = encodeQualifications(original)
      const decoded = decodeQualifications(encoded)

      expect(decoded.v).toBe(original.v)
      expect(decoded.completed).toBe(original.completed)
      expect(decoded.salary).toBe(original.salary)
      expect(decoded.age).toBe(original.age)
      expect(decoded.degree).toBe(original.degree)
      expect(decoded.s).toBe(original.s)
      expect(decoded._v).toBe(CALCULATOR_STATE_VERSION)
    })

    it('should produce non-outdated state after encoding', () => {
      const qualifications = QualificationsSchema.parse({
        v: VisaType.Engineer,
        completed: 0,
        s: 'test-session',
        _v: 0, // Start with old version
      })

      const encoded = encodeQualifications(qualifications)
      const decoded = decodeQualifications(encoded)

      expect(isStateVersionOutdated(decoded)).toBe(false)
    })
  })

  describe('visa type specific versioning', () => {
    it('should work for researcher visa type', () => {
      const qualifications = QualificationsSchema.parse({
        v: VisaType.Researcher,
        completed: 0,
        _v: CALCULATOR_STATE_VERSION,
      })

      expect(isStateVersionOutdated(qualifications)).toBe(false)
    })

    it('should work for business manager visa type', () => {
      const qualifications = QualificationsSchema.parse({
        v: VisaType.BusinessManager,
        completed: 0,
        _v: CALCULATOR_STATE_VERSION,
      })

      expect(isStateVersionOutdated(qualifications)).toBe(false)
    })
  })
})
