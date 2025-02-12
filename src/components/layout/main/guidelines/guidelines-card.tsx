import { Card } from "../../../ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../ui/accordion"
import { GUIDELINES } from "../../../../lib/constants"
import { CustomButton } from "../../../ui/button"

interface GuidelinesCardProps {
  onClose?: () => void;
}

export function GuidelinesCard({ onClose }: GuidelinesCardProps) {
  return (
    <Card className="p-6 max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-red-800 mb-4 font-display">HƯỚNG DẪN</h2>
      <Accordion type="single" collapsible>
        {GUIDELINES.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="font-medium text-left">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      {onClose && (
        <CustomButton 
          onClick={onClose}
          color="primary" 
          className="mt-4 w-full"
        >
          Đã hiểu
        </CustomButton>
      )}
    </Card>
  )
}

