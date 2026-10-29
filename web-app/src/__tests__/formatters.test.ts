import { describe, it, expect } from 'vitest';
import {
  formatStatusLabel,
  getStatusBadgeVariant,
  getPriorityBadgeVariant,
  formatDate,
  formatTimeAgo,
} from '../utils/formatters';

describe('CivicFix UI Formatters & Badge Design Token Tests', () => {
  describe('formatStatusLabel', () => {
    it('formats snake_case statuses to human readable labels', () => {
      expect(formatStatusLabel('submitted')).toBe('Submitted');
      expect(formatStatusLabel('under_review')).toBe('Under Review');
      expect(formatStatusLabel('in_progress')).toBe('In Progress');
      expect(formatStatusLabel('resolved')).toBe('Resolved');
      expect(formatStatusLabel('closed')).toBe('Closed');
    });
  });

  describe('getStatusBadgeVariant', () => {
    it('maps lifecycle statuses to proper semantic variants', () => {
      expect(getStatusBadgeVariant('submitted')).toBe('info');
      expect(getStatusBadgeVariant('under_review')).toBe('warning');
      expect(getStatusBadgeVariant('in_progress')).toBe('primary');
      expect(getStatusBadgeVariant('assigned')).toBe('primary');
      expect(getStatusBadgeVariant('resolved')).toBe('success');
      expect(getStatusBadgeVariant('rejected')).toBe('danger');
      expect(getStatusBadgeVariant('closed')).toBe('neutral');
    });
  });

  describe('getPriorityBadgeVariant', () => {
    it('maps urgency levels to severity colors', () => {
      expect(getPriorityBadgeVariant('urgent')).toBe('danger');
      expect(getPriorityBadgeVariant('high')).toBe('warning');
      expect(getPriorityBadgeVariant('medium')).toBe('info');
      expect(getPriorityBadgeVariant('low')).toBe('neutral');
    });
  });

  describe('formatDate', () => {
    it('formats ISO dates correctly', () => {
      const formatted = formatDate('2026-10-29T10:30:00Z');
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });
  });

  describe('formatTimeAgo', () => {
    it('calculates relative time ago', () => {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString();

      expect(formatTimeAgo(tenMinutesAgo)).toContain('m ago');
      expect(formatTimeAgo(threeHoursAgo)).toBe('3h ago');
      expect(formatTimeAgo(twoDaysAgo)).toBe('2d ago');
    });
  });
});
