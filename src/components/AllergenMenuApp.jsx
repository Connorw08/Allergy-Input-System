import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlusCircle, Trash2, Save, Pencil } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const AllergenMenuApp = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    allergens: {
      gluten: false,
      dairy: false,
      nuts: false,
      eggs: false,
      soy: false,
      shellfish: false,
      fish: false,
      sesame: false
    }
  });

  const allergensList = [
    { id: 'gluten', label: 'Gluten' },
    { id: 'dairy', label: 'Dairy' },
    { id: 'nuts', label: 'Nuts' },
    { id: 'eggs', label: 'Eggs' },
    { id: 'soy', label: 'Soy' },
    { id: 'shellfish', label: 'Shellfish' },
    { id: 'fish', label: 'Fish' },
    { id: 'sesame', label: 'Sesame' }
  ];

  // Fetch all menu items
  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${API_URL}/menu-items`);
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllergenChange = (allergenId) => {
    setNewItem(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        [allergenId]: !prev.allergens[allergenId]
      }
    }));
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/menu-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newItem,
          price: parseFloat(newItem.price)
        }),
      });

      if (!response.ok) throw new Error('Failed to add menu item');

      await fetchMenuItems();
      setMessage('Item added successfully');
      setNewItem({
        name: '',
        description: '',
        price: '',
        allergens: {
          gluten: false,
          dairy: false,
          nuts: false,
          eggs: false,
          soy: false,
          shellfish: false,
          fish: false,
          sesame: false
        }
      });
    } catch (err) {
      setError('Failed to add item');
      console.error('Error:', err);
    }
  };

  const handleEditItem = async (id) => {
    if (editingId === id) {
      try {
        const response = await fetch(`${API_URL}/menu-items/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });

        if (!response.ok) throw new Error('Failed to update menu item');

        await fetchMenuItems();
        setMessage('Item updated successfully');
        setEditingId(null);
        setNewItem({
          name: '',
          description: '',
          price: '',
          allergens: {
            gluten: false,
            dairy: false,
            nuts: false,
            eggs: false,
            soy: false,
            shellfish: false,
            fish: false,
            sesame: false
          }
        });
      } catch (err) {
        setError('Failed to update item');
        console.error('Error:', err);
      }
    } else {
      const item = menuItems.find(item => item._id === id);
      setNewItem(item);
      setEditingId(id);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`${API_URL}/menu-items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete menu item');

      await fetchMenuItems();
      setMessage('Item deleted successfully');
    } catch (err) {
      setError('Failed to delete item');
      console.error('Error:', err);
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Menu Item' : 'Add New Menu Item'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                placeholder="Enter item name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={newItem.description}
                onChange={handleInputChange}
                placeholder="Enter item description"
              />
            </div>

            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={newItem.price}
                onChange={handleInputChange}
                placeholder="Enter price"
              />
            </div>

            <div>
              <Label>Allergens</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {allergensList.map(allergen => (
                  <div key={allergen.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={allergen.id}
                      checked={newItem.allergens[allergen.id]}
                      onCheckedChange={() => handleAllergenChange(allergen.id)}
                    />
                    <Label htmlFor={allergen.id}>{allergen.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={editingId ? () => handleEditItem(editingId) : handleAddItem}
              className="w-full"
            >
              {editingId ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Item
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {(message || error) && (
        <Alert className="mb-4">
          <AlertDescription>{message || error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {menuItems.map(item => (
          <Card key={item._id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="font-medium">${item.price}</p>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Allergens:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.entries(item.allergens)
                        .filter(([, value]) => value)
                        .map(([key]) => (
                          <span
                            key={key}
                            className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                          >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditItem(item._id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteItem(item._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllergenMenuApp;