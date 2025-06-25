import { useState } from 'react';

// Constants for form options
export const DEITIES = ['Shiva', 'Vishnu', 'Brahma', 'Shakti', 'Ganesha', 'Murugan', 'Hanuman', 'Surya'];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 
  'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Puducherry'
];

export const ARCHITECTURES = [
  'Dravidian', 'Nagara', 'Vesara', 'Kalinga', 'Chalukya', 'Hoysala', 'Vijayanagara', 
  'Chola', 'Pallava', 'Pandyan', 'Maratha', 'Rajput', 'Mughal', 'Indo-Islamic', 
  'Kerala', 'Goan', 'Sikh', 'Jain', 'Buddhist'
];

const initialFormData = {
  name: '',
  deity: '',
  state: '',
  city: '',
  district: '',
  architecture: '',
  about: '',
  builtBy: '',
  constructionPeriod: '',
  significance: '',
  phone: '',
  website: '',
  mapsLink: '',
  image: '',
  festivals: [
    {
      name: '',
      period: '',
      description: ''
    }
  ]
};

export function usePlaceForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFestivalChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      festivals: prev.festivals.map((festival, i) => 
        i === index ? { ...festival, [field]: value } : festival
      )
    }));
  };

  const addFestival = () => {
    setFormData(prev => ({
      ...prev,
      festivals: [...prev.festivals, { name: '', period: '', description: '' }]
    }));
  };

  const removeFestival = (index) => {
    if (formData.festivals.length > 1) {
      setFormData(prev => ({
        ...prev,
        festivals: prev.festivals.filter((_, i) => i !== index)
      }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const validateForm = () => {
    const requiredFields = ['name', 'deity', 'state', 'city', 'architecture', 'about'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      return {
        isValid: false,
        errors: missingFields.map(field => `${field} is required`)
      };
    }

    // Validate character limits
    if (formData.about.length > 500) {
      return {
        isValid: false,
        errors: ['About temple description exceeds 500 characters']
      };
    }

    if (formData.significance.length > 1000) {
      return {
        isValid: false,
        errors: ['Historical significance exceeds 1000 characters']
      };
    }

    // Validate festivals
    const festivalErrors = [];
    formData.festivals.forEach((festival, index) => {
      if (festival.name.trim() && festival.description.split(' ').length > 20) {
        festivalErrors.push(`Festival ${index + 1} description exceeds 20 words`);
      }
    });

    if (festivalErrors.length > 0) {
      return {
        isValid: false,
        errors: festivalErrors
      };
    }

    return { isValid: true, errors: [] };
  };

  const handleSubmit = async (onSubmitCallback) => {
    const validation = validateForm();
    
    if (!validation.isValid) {
      console.error('Form validation failed:', validation.errors);
      return { success: false, errors: validation.errors };
    }

    setIsSubmitting(true);
    
    try {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      
      // Call the callback function if provided (for custom submission logic)
      if (onSubmitCallback) {
        await onSubmitCallback(formData);
      }
      
      resetForm();
      return { success: true, data: formData };
    } catch (error) {
      console.error('Form submission error:', error);
      return { success: false, errors: [error.message] };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleFestivalChange,
    addFestival,
    removeFestival,
    resetForm,
    handleSubmit,
    validateForm
  };
}