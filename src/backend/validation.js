// middleware/validation.js
const validateMenuItem = (req, res, next) => {
    const { name, price, allergens } = req.body;
  
    // Validate required fields
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Name is required' });
    }
  
    if (!price || isNaN(price) || price < 0) {
      return res.status(400).json({ message: 'Valid price is required' });
    }
  
    // Validate allergens structure
    const requiredAllergens = ['gluten', 'dairy', 'nuts', 'eggs', 'soy', 'shellfish', 'fish', 'sesame'];
    if (allergens) {
      const invalidAllergens = Object.keys(allergens).filter(
        key => !requiredAllergens.includes(key) || typeof allergens[key] !== 'boolean'
      );
      
      if (invalidAllergens.length > 0) {
        return res.status(400).json({ 
          message: 'Invalid allergens format',
          invalidFields: invalidAllergens 
        });
      }
    }
  
    next();
  };
  
  module.exports = { validateMenuItem };