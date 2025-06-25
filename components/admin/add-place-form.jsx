'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus } from 'lucide-react';
import { usePlaceForm, DEITIES, INDIAN_STATES, ARCHITECTURES } from '@/hooks/use-place-form';

export default function AddPlaceForm({ isOpen, onClose, onSubmit }) {
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleFestivalChange,
    addFestival,
    removeFestival,
    resetForm,
    handleSubmit
  } = usePlaceForm();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const result = await handleSubmit(onSubmit);
    
    if (result.success) {
      onClose();
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add New Temple/Sacred Place</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <form onSubmit={handleFormSubmit} className="space-y-6 p-1">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Temple Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter temple name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deity">Deity *</Label>
                <Select value={formData.deity} onValueChange={(value) => handleInputChange('deity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select deity" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEITIES.map(deity => (
                      <SelectItem key={deity} value={deity}>{deity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-40">
                      {INDIAN_STATES.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder="Enter district name"
                />
              </div>
            </div>

            {/* Architecture and Construction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="architecture">Architecture *</Label>
                <Select value={formData.architecture} onValueChange={(value) => handleInputChange('architecture', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select architecture style" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-40">
                      {ARCHITECTURES.map(arch => (
                        <SelectItem key={arch} value={arch}>{arch}</SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="constructionPeriod">Construction Period</Label>
                <Input
                  id="constructionPeriod"
                  value={formData.constructionPeriod}
                  onChange={(e) => handleInputChange('constructionPeriod', e.target.value)}
                  placeholder="e.g., 12th century CE"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="builtBy">Built By</Label>
              <Input
                id="builtBy"
                value={formData.builtBy}
                onChange={(e) => handleInputChange('builtBy', e.target.value)}
                placeholder="e.g., Chola Dynasty, Raja Raja Chola I"
              />
            </div>

            {/* Descriptions */}
            <div className="space-y-2">
              <Label htmlFor="about">About Temple *</Label>
              <Textarea
                id="about"
                value={formData.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                placeholder="Brief description about the temple (max 100 words)"
                maxLength={500}
                rows={3}
                required
              />
              <div className="text-xs text-gray-500 text-right">
                {formData.about.length}/500 characters
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="significance">Historical Significance</Label>
              <Textarea
                id="significance"
                value={formData.significance}
                onChange={(e) => handleInputChange('significance', e.target.value)}
                placeholder="Historical significance and importance (max 200 words)"
                maxLength={1000}
                rows={4}
              />
              <div className="text-xs text-gray-500 text-right">
                {formData.significance.length}/1000 characters
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 XXXXXXXXXX"
                  type="tel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Official Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mapsLink">Maps Direction Link</Label>
              <Input
                id="mapsLink"
                value={formData.mapsLink}
                onChange={(e) => handleInputChange('mapsLink', e.target.value)}
                placeholder="Google Maps or other navigation link"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Temple Image Link</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/temple-image.jpg"
                type="url"
              />
            </div>

            {/* Festivals Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Major Festivals</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFestival}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Festival
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.festivals.map((festival, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        Festival {index + 1}
                      </h4>
                      {formData.festivals.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFestival(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`festival-name-${index}`} className="text-sm">
                          Festival Name
                        </Label>
                        <Input
                          id={`festival-name-${index}`}
                          value={festival.name}
                          onChange={(e) => handleFestivalChange(index, 'name', e.target.value)}
                          placeholder="e.g., Maha Shivaratri"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`festival-period-${index}`} className="text-sm">
                          Period/Months
                        </Label>
                        <Input
                          id={`festival-period-${index}`}
                          value={festival.period}
                          onChange={(e) => handleFestivalChange(index, 'period', e.target.value)}
                          placeholder="e.g., February/March"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor={`festival-description-${index}`} className="text-sm">
                        Short Description (max 20 words)
                      </Label>
                      <Textarea
                        id={`festival-description-${index}`}
                        value={festival.description}
                        onChange={(e) => handleFestivalChange(index, 'description', e.target.value)}
                        placeholder="Brief description of the festival celebration"
                        rows={2}
                      />
                      <div className="text-xs text-gray-500 text-right">
                        {festival.description.split(' ').filter(word => word.trim()).length}/20 words
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Place'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}