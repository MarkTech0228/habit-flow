/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};


/**
 * Validate password strength with detailed requirements
 */
export const getPasswordStrength = (password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
} => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };


  const metRequirements = Object.values(requirements).filter(Boolean).length;


  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (metRequirements >= 5) strength = 'strong';
  else if (metRequirements >= 3) strength = 'medium';


  return {
    isValid: requirements.length && metRequirements >= 2,
    strength,
    requirements,
  };
};


/**
 * Validate amount (positive number)
 */
export const isValidAmount = (amount: number | string): boolean => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(num) && num > 0;
};


/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
 
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};


/**
 * Validate habit title
 */
export const isValidHabitTitle = (title: string): boolean => {
  return title.trim().length > 0 && title.length <= 100;
};


/**
 * Validate todo title
 */
export const isValidTodoTitle = (title: string): boolean => {
  return title.trim().length > 0 && title.length <= 200;
};


/**
 * Sanitize input string
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};


/**
 * Validate phone number (basic)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
};


/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};


/**
 * Validate percentage (0-100)
 */
export const isValidPercentage = (value: number): boolean => {
  return !isNaN(value) && value >= 0 && value <= 100;
};

