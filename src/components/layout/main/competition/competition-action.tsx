import { CustomButton } from "../../../ui/button"
import { useTranslation } from 'react-i18next';
import { useState } from "react";
import React, { lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../store/hooks";
import { useCompetitionStatus } from "../../../../hooks/useCompetitionStatus";

const GuidelinesModal = lazy(() => import('./guidelines-modal'));

export function CompetitionActions() {
  const { isEnded } = useCompetitionStatus();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const handleJoinCompetition = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/exam');
  };

  return (
    <>
      <div className="flex justify-center gap-4 mb-8">
        <CustomButton 
          color="primary"
          onClick={handleJoinCompetition}
          disabled={isEnded}
        >
          {isEnded ? 'Đã kết thúc' : t('competition.join')}
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

