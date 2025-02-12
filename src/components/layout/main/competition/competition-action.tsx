import { CustomButton } from "../../../ui/button"
import { useTranslation } from 'react-i18next';
import { useState } from "react";
import React, { lazy } from "react";

const GuidelinesModal = lazy(() => import('./guidelines-modal'));

export function CompetitionActions() {
  const { t } = useTranslation();
  const [showGuidelines, setShowGuidelines] = useState(false);

  return (
    <>
      <div className="flex justify-center gap-4 mb-8">
        <CustomButton color="primary">
          {t('competition.join')}
        </CustomButton>
        <CustomButton 
          variant="outline" 
          color="primary"
          onClick={() => setShowGuidelines(true)}
        >
          {t('competition.rules')}
        </CustomButton>
      </div>

      {showGuidelines && (
        <React.Suspense fallback={null}>
          <GuidelinesModal 
            onClose={() => setShowGuidelines(false)}
          />
        </React.Suspense>
      )}
    </>
  )
}

