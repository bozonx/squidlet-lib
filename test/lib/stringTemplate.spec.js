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
      assert.equal(mustacheTemplate(null, testData), '')
      assert.equal(mustacheTemplate(undefined, testData), '')
    })

    it('should handle null data', () => {
      const template = 'Hello {{user.name}}'
      assert.equal(mustacheTemplate(template, null), template)
      assert.equal(mustacheTemplate(template, undefined), template)
    })

    it('should handle null values in data', () => {
      const template =
        'Address: {{user.address.street}}, Settings: {{user.settings.enabled}}'
      assert.equal(
        mustacheTemplate(template, testData),
        'Address: , Settings: '
      )
    })

    it('should handle null in arrays', () => {
      const template = 'Hobby: {{user.hobbies[1]}}'
      assert.equal(mustacheTemplate(template, testData), 'Hobby: ')
    })

    it('should handle falsy values correctly', () => {
      const template = 'Count: {{count}}, Active: {{active}}, Empty: {{empty}}'
      assert.equal(
        mustacheTemplate(template, testData),
        'Count: 0, Active: false, Empty: '
      )
    })

    it('should handle normal cases', () => {
      const template = 'Hello {{user.name}} from {{user.address.city}}'
      assert.equal(
        mustacheTemplate(template, testData),
        'Hello John from New York'
      )
    })

    it('should handle complex null paths', () => {
      const complexData = {
        level1: { level2: null, level3: { value: 'test' } },
      }
      const template =
        'Value: {{level1.level2.someProperty}}, Test: {{level1.level3.value}}'
      assert.equal(
        mustacheTemplate(template, complexData),
        'Value: , Test: test'
      )
    })
  })

  describe('standardTemplate', () => {
    it('should handle null template', () => {
      assert.equal(standardTemplate(null, testData), '')
      assert.equal(standardTemplate(undefined, testData), '')
    })

    it('should handle null data', () => {
      const template = 'Hello ${user.name}'
      assert.equal(standardTemplate(template, null), template)
      assert.equal(standardTemplate(template, undefined), template)
    })

    it('should handle null values in data', () => {
      const template =
        'Address: ${user.address.street}, Settings: ${user.settings.enabled}'
      assert.equal(
        standardTemplate(template, testData),
        'Address: , Settings: '
      )
    })

    it('should handle null in arrays', () => {
      const template = 'Hobby: ${user.hobbies[1]}'
      assert.equal(standardTemplate(template, testData), 'Hobby: ')
    })

    it('should handle falsy values correctly', () => {
      const template = 'Count: ${count}, Active: ${active}, Empty: ${empty}'
      assert.equal(
        standardTemplate(template, testData),
        'Count: 0, Active: false, Empty: '
      )
    })

    it('should handle normal cases', () => {
      const template = 'Hello ${user.name} from ${user.address.city}'
      assert.equal(
        standardTemplate(template, testData),
        'Hello John from New York'
      )
    })

    it('should handle complex null paths', () => {
      const complexData = {
        level1: { level2: null, level3: { value: 'test' } },
      }
      const template =
        'Value: ${level1.level2.someProperty}, Test: ${level1.level3.value}'
      assert.equal(
        standardTemplate(template, complexData),
        'Value: , Test: test'
      )
    })
  })
})
