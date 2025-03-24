import CalendarWidget from '@/components/Events/CalendarWidget';
import { Button } from '@/components/Common/Button';

export default function EventsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events & Workshops</h1>
        <Button variant="primary">
          Create New Event
        </Button>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <CalendarWidget />
      </div>
    </div>
  );
}