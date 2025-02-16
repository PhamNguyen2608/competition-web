import { Card } from "../../../ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../ui/accordion"
import { GUIDELINES } from "../../../../lib/constants"
import { CustomButton } from "../../../ui/button"
import { useTranslation } from "react-i18next"

interface GuidelinesCardProps {
  readonly onClose?: () => void;
}

export function GuidelinesCard({ onClose }: GuidelinesCardProps) {
  const { t } = useTranslation()
  
  return (
    <Card className="p-6 max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-red-800 mb-4 font-display">{t('guidelines.title')}</h2>
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
          {t('guidelines.understood')}
        </CustomButton>
      )}
    </Card>
  )
}

