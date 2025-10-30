import { TRANSFORM_PROPERTIES, IDENTITY_MATRIX } from '../constants/motion-defaults.constants';

/**
 * Check if a property should be handled as a transform
 */
export function isTransformProperty(key: string): boolean {
  return TRANSFORM_PROPERTIES.includes(key as any);
}

/**
 * Create an identity matrix for transform operations
 */
export function createIdentityMatrix(): number[] {
  return [...IDENTITY_MATRIX];
}

/**
 * Parse a matrix string to array of numbers
 */
export function parseMatrix(matrixString: string): number[] {
  const match = matrixString.match(/matrix\((.*)\)/);
  if (!match) return createIdentityMatrix();
  return match[1].split(',').map(Number);
}

/**
 * Multiply two 2D transformation matrices
 */
export function multiplyMatrices(a: number[], b: number[]): number[] {
  return [
    a[0] * b[0] + a[2] * b[1],              // a
    a[1] * b[0] + a[3] * b[1],              // b
    a[0] * b[2] + a[2] * b[3],              // c
    a[1] * b[2] + a[3] * b[3],              // d
    a[0] * b[4] + a[2] * b[5] + a[4],       // e
    a[1] * b[4] + a[3] * b[5] + a[5]        // f
  ];
}

/**
 * Convert a matrix array to CSS matrix string
 */
export function matrixToCssString(matrix: number[]): string {
  return `matrix(${matrix.join(',')})`;
}

/**
 * Create a transformation matrix for a specific transform type
 */
export function createTransformMatrix(key: string, value: any): number[] {
  switch (key) {
    case 'x':
      return [1, 0, 0, 1, value, 0];
    case 'y':
      return [1, 0, 0, 1, 0, value];
    case 'rotate':
      const rad = (value * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      return [cos, sin, -sin, cos, 0, 0];
    case 'scale':
      return [value, 0, 0, value, 0, 0];
    case 'scaleX':
      return [value, 0, 0, 1, 0, 0];
    case 'scaleY':
      return [1, 0, 0, value, 0, 0];
    default:
      return createIdentityMatrix();
  }
}

/**
 * Apply a transform property to a result object
 * Handles keyframe arrays and individual values
 */
export function applyTransformProperty(
  result: Record<string, any>,
  key: string,
  value: any
): void {
  // If keyframe array is provided, let Motion One handle it directly
  if (Array.isArray(value)) {
    result[key] = value;
    return;
  }

  // Initialize transform matrix if it doesn't exist
  if (!result['transform']) {
    result['transform'] = matrixToCssString(createIdentityMatrix());
  }

  // Parse current matrix
  const currentMatrix = parseMatrix(result['transform']);

  // Create new matrix based on the transform type
  const newMatrix = createTransformMatrix(key, value);

  // Multiply matrices
  const finalMatrix = multiplyMatrices(currentMatrix, newMatrix);

  // Apply the new matrix
  result['transform'] = matrixToCssString(finalMatrix);
}

/**
 * Normalize the transform property by trimming extra spaces
 */
export function normalizeTransformProperty(result: Record<string, any>): void {
  if (result['transform']) {
    result['transform'] = result['transform'].trim();
  }
}
