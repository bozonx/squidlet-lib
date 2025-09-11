import { mustacheTemplate, standardTemplate } from '../../lib/stringTemplate.js'

describe('lib/stringTemplate', () => {
  const testData = {
    user: {
      name: 'John',
      age: 30,
      address: { city: 'New York', street: null },
      hobbies: ['reading', null, 'gaming'],
      settings: null,
    },
    count: 0,
    active: false,
    empty: '',
  }

  describe('mustacheTemplate', () => {
    it('should handle null template', () => {
      expect(mustacheTemplate(null, testData)).toBe('')
      expect(mustacheTemplate(undefined, testData)).toBe('')
    })

    it('should handle null data', () => {
      const template = 'Hello {{user.name}}'
      expect(mustacheTemplate(template, null)).toBe(template)
      expect(mustacheTemplate(template, undefined)).toBe(template)
    })

    it('should handle null values in data', () => {
      const template =
        'Address: {{user.address.street}}, Settings: {{user.settings.enabled}}'
      expect(mustacheTemplate(template, testData)).toBe('Address: , Settings: ')
    })

    it('should handle null in arrays', () => {
      const template = 'Hobby: {{user.hobbies[1]}}'
      expect(mustacheTemplate(template, testData)).toBe('Hobby: ')
    })

    it('should handle falsy values correctly', () => {
      const template = 'Count: {{count}}, Active: {{active}}, Empty: {{empty}}'
      expect(mustacheTemplate(template, testData)).toBe(
        'Count: 0, Active: false, Empty: '
      )
    })

    it('should handle normal cases', () => {
      const template = 'Hello {{user.name}} from {{user.address.city}}'
      expect(mustacheTemplate(template, testData)).toBe(
        'Hello John from New York'
      )
    })

    it('should handle complex null paths', () => {
      const complexData = {
        level1: { level2: null, level3: { value: 'test' } },
      }
      const template =
        'Value: {{level1.level2.someProperty}}, Test: {{level1.level3.value}}'
      expect(mustacheTemplate(template, complexData)).toBe(
        'Value: , Test: test'
      )
    })
  })

  describe('standardTemplate', () => {
    it('should handle null template', () => {
      expect(standardTemplate(null, testData)).toBe('')
      expect(standardTemplate(undefined, testData)).toBe('')
    })

    it('should handle null data', () => {
      const template = 'Hello ${user.name}'
      expect(standardTemplate(template, null)).toBe(template)
      expect(standardTemplate(template, undefined)).toBe(template)
    })

    it('should handle null values in data', () => {
      const template =
        'Address: ${user.address.street}, Settings: ${user.settings.enabled}'
      expect(standardTemplate(template, testData)).toBe('Address: , Settings: ')
    })

    it('should handle null in arrays', () => {
      const template = 'Hobby: ${user.hobbies[1]}'
      expect(standardTemplate(template, testData)).toBe('Hobby: ')
    })

    it('should handle falsy values correctly', () => {
      const template = 'Count: ${count}, Active: ${active}, Empty: ${empty}'
      expect(standardTemplate(template, testData)).toBe(
        'Count: 0, Active: false, Empty: '
      )
    })

    it('should handle normal cases', () => {
      const template = 'Hello ${user.name} from ${user.address.city}'
      expect(standardTemplate(template, testData)).toBe(
        'Hello John from New York'
      )
    })

    it('should handle complex null paths', () => {
      const complexData = {
        level1: { level2: null, level3: { value: 'test' } },
      }
      const template =
        'Value: ${level1.level2.someProperty}, Test: ${level1.level3.value}'
      expect(standardTemplate(template, complexData)).toBe(
        'Value: , Test: test'
      )
    })
  })
})
