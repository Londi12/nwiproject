import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DropdownTest() {
  const [selectValue, setSelectValue] = React.useState('');
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  return (
    <div className="p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Dropdown Component Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Select Component Test */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Select Component Test</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Visa Type</label>
                <Select value={selectValue} onValueChange={setSelectValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visa type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="express-entry">Express Entry</SelectItem>
                    <SelectItem value="work-permit">Work Permit</SelectItem>
                    <SelectItem value="family-sponsorship">Family Sponsorship</SelectItem>
                    <SelectItem value="study-permit">Study Permit</SelectItem>
                    <SelectItem value="tourist-visa">Tourist Visa</SelectItem>
                    <SelectItem value="business-visa">Business Visa</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-2">Selected: {selectValue || 'None'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Priority Level</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Popover Component Test */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Popover Component Test</h3>
            <div className="flex gap-4">
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-3">
                    <h4 className="font-medium">Immigration Services</h4>
                    <p className="text-sm text-gray-600">
                      Choose from our comprehensive immigration services to help you achieve your goals.
                    </p>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full" onClick={() => setPopoverOpen(false)}>
                        Express Entry Consultation
                      </Button>
                      <Button size="sm" variant="outline" className="w-full" onClick={() => setPopoverOpen(false)}>
                        Document Review
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Another Popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">Quick Actions</h4>
                    <p className="text-sm text-gray-600">Test click outside and escape key functionality.</p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Test Instructions:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click on dropdowns to open them</li>
              <li>• Click outside to close (should work)</li>
              <li>• Press Escape key to close (should work)</li>
              <li>• Select items should close the dropdown</li>
              <li>• Multiple dropdowns should not interfere with each other</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
