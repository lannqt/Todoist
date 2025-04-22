import { useState } from "react";
import { format } from "date-fns"; // Impor fungsi format
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Tentukan tipe untuk props DatePicker
interface DatePickerProps {
  value: string | null; // Nilai awal (bisa string atau null)
  onChange: (date: string | null) => void; // Fungsi yang dipanggil saat tanggal berubah
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    // Panggil onChange dengan nilai yang diformat atau null jika tanggal tidak dipilih
    onChange(selectedDate ? format(selectedDate, "yyyy-MM-dd") : null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}