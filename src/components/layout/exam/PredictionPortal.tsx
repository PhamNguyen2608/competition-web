import { useState, useEffect } from 'react';
import { CustomButton } from '../../ui/button';
import { PredictionService } from '../../../services/predictionService';
import { useAppSelector } from '../../../store/hooks';
import { Portal, PortalContent } from '../../Portal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { cn } from '../../../lib/utils';

interface PredictionPortalProps {
  onClose: () => void;
}

export function PredictionPortal({ onClose }: PredictionPortalProps) {
  const [predictedCount, setPredictedCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPredicted, setHasPredicted] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkPrediction = async () => {
      if (!user) return;
      const predicted = await PredictionService.hasPredicted(user.uid);
      setHasPredicted(predicted);
      if (predicted) {
        // Tự động đóng portal nếu đã dự đoán
        onClose();
      }
    };
    checkPrediction();
  }, [user, onClose]);

  const handleSubmit = async () => {
    if (!user || hasPredicted) return;
    
    setIsSubmitting(true);
    try {
      const success = await PredictionService.savePrediction(user.uid, predictedCount);
      if (success) {
        onClose();
      } else {
        // Nếu không thành công (đã dự đoán rồi), cập nhật state
        setHasPredicted(true);
      }
    } catch (error) {
      console.error('Error saving prediction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasPredicted) {
    return null;
  }

  return (
    <Portal>
      <PortalContent position="center" onClose={onClose}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Dự đoán số người tham gia</CardTitle>
            <CardDescription className="text-center">
              Bạn dự đoán sẽ có bao nhiêu người tham gia cuộc thi này?
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prediction">Số người dự đoán</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="prediction"
                    type="number"
                    min="0"
                    value={predictedCount}
                    onChange={(e) => setPredictedCount(parseInt(e.target.value) || 0)}
                    className={cn(
                      "text-lg font-medium",
                      "focus:ring-2 focus:ring-primary"
                    )}
                    placeholder="Nhập số người..."
                  />
                  <span className="text-gray-600 font-medium">người</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-4">
            <CustomButton
              onClick={onClose}
              variant="outline"
              color="muted"
            >
              Đóng
            </CustomButton>
            <CustomButton
              onClick={handleSubmit}
              disabled={isSubmitting || predictedCount <= 0 || hasPredicted}
              color="primary"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi dự đoán'}
            </CustomButton>
          </CardFooter>
        </Card>
      </PortalContent>
    </Portal>
  );
}