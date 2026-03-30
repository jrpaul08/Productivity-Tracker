import { describe, it, expect, beforeEach } from 'vitest'
import { getEntries, saveEntries } from '../storage.js'

describe('getEntries', () => {
  beforeEach(() => localStorage.clear())

  it('returns empty array when nothing stored', () => {
    expect(getEntries()).toEqual([])
  })

  it('returns empty array when stored value is malformed JSON', () => {
    localStorage.setItem('jsd_entries', 'not-json')
    expect(getEntries()).toEqual([])
  })
})

describe('saveEntries / getEntries round-trip', () => {
  beforeEach(() => localStorage.clear())

  it('persists entries and retrieves them', () => {
    const entries = [{ id: '1', category: 'Admin', duration: 30 }]
    saveEntries(entries)
    expect(getEntries()).toEqual(entries)
  })

  it('overwrites previous entries on second save', () => {
    saveEntries([{ id: '1' }])
    saveEntries([{ id: '2' }])
    expect(getEntries()).toEqual([{ id: '2' }])
  })
})
