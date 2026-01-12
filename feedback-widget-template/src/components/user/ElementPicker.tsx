/**
 * Feedback Widget Template - Element Picker
 * 
 * Allows users to visually select UI elements to target with their feedback.
 * Creates an overlay that highlights elements on hover and captures selection.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { ElementPickerProps, TargetElement } from '../../types/feedback';

// ============================================
// SELECTOR GENERATOR
// ============================================

function generateSelector(element: HTMLElement): string {
  // Use ID if available
  if (element.id) {
    return `#${element.id}`;
  }

  // Build path from element
  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();

    // Add classes for specificity
    if (current.className && typeof current.className === 'string') {
      const classes = current.className
        .split(' ')
        .filter(c => c.trim() && !c.startsWith('hover:') && !c.includes(':'))
        .slice(0, 2)
        .join('.');
      if (classes) {
        selector += `.${classes}`;
      }
    }

    // Add nth-child for uniqueness
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        child => child.tagName === current!.tagName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(' > ');
}

// ============================================
// ELEMENT PICKER COMPONENT
// ============================================

export function ElementPicker({ isActive, onSelect, onCancel }: ElementPickerProps) {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  // Handle mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Ignore our own overlay elements
    if (target.closest('[data-feedback-picker]')) {
      return;
    }

    setHoveredElement(target);
    setHighlightRect(target.getBoundingClientRect());
  }, []);

  // Handle element selection
  const handleClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    
    // Ignore clicks on our overlay
    if (target.closest('[data-feedback-picker]')) {
      return;
    }

    const elementData: TargetElement = {
      selector: generateSelector(target),
      tagName: target.tagName.toLowerCase(),
      className: target.className || '',
      textPreview: (target.textContent || '').slice(0, 100).trim(),
      boundingBox: {
        top: target.getBoundingClientRect().top,
        left: target.getBoundingClientRect().left,
        width: target.getBoundingClientRect().width,
        height: target.getBoundingClientRect().height,
      },
    };

    onSelect(elementData);
  }, [onSelect]);

  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  }, [onCancel]);

  // Set up event listeners
  useEffect(() => {
    if (!isActive) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown);

    // Add cursor style
    document.body.style.cursor = 'crosshair';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.cursor = '';
    };
  }, [isActive, handleMouseMove, handleClick, handleKeyDown]);

  if (!isActive) return null;

  return createPortal(
    <div data-feedback-picker="true">
      {/* Semi-transparent overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          zIndex: 99998,
          pointerEvents: 'none',
        }}
      />

      {/* Highlight box */}
      {highlightRect && (
        <div
          style={{
            position: 'fixed',
            top: highlightRect.top - 2,
            left: highlightRect.left - 2,
            width: highlightRect.width + 4,
            height: highlightRect.height + 4,
            border: '2px solid #3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: 4,
            zIndex: 99999,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Instructions bar */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '12px 24px',
          borderRadius: 8,
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        }}
      >
        <span style={{ fontSize: 14 }}>
          Click on any element to select it
        </span>
        <button
          onClick={onCancel}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          Cancel (Esc)
        </button>
      </div>

      {/* Element info tooltip */}
      {hoveredElement && highlightRect && (
        <div
          style={{
            position: 'fixed',
            top: Math.min(highlightRect.bottom + 8, window.innerHeight - 60),
            left: Math.max(8, Math.min(highlightRect.left, window.innerWidth - 200)),
            backgroundColor: '#1f2937',
            color: 'white',
            padding: '8px 12px',
            borderRadius: 6,
            zIndex: 100000,
            fontSize: 12,
            maxWidth: 300,
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            &lt;{hoveredElement.tagName.toLowerCase()}&gt;
          </div>
          {hoveredElement.className && (
            <div style={{ opacity: 0.7, fontSize: 11 }}>
              .{String(hoveredElement.className).split(' ').slice(0, 2).join(' .')}
            </div>
          )}
        </div>
      )}
    </div>,
    document.body
  );
}

export default ElementPicker;
