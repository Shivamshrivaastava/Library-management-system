
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLibrary } from '@/context/LibraryContext';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

export const CustomReminderForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [customMessage, setCustomMessage] = useState<string>('');
  const { sendCustomDateReminders } = useLibrary();
  
  const handleSendReminders = () => {
    if (!selectedDate) {
      toast({
        title: "Select a Date",
        description: "Please select a date for sending reminders.",
        variant: "destructive"
      });
      return;
    }
    
    const remindersSent = sendCustomDateReminders(selectedDate, customMessage || undefined);
    
    if (remindersSent > 0) {
      toast({
        title: "Reminders Sent",
        description: `${remindersSent} reminder${remindersSent > 1 ? 's' : ''} sent to students.`,
      });
      setCustomMessage('');
    } else {
      toast({
        title: "No Reminders Sent",
        description: "There are no books due on or before the selected date.",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Custom Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Target Due Date:</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground">
            Reminders will be sent to students with books due on or before this date.
          </p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Message (Optional):</label>
          <Textarea
            placeholder="Enter a custom reminder message..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">
            Leave blank to use the default reminder message.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSendReminders} className="w-full">
          Send Custom Reminders
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CustomReminderForm;
