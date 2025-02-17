import { Portal, PortalContent } from "../../../components/Portal";
import { CustomButton } from "../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";

interface RewardCategory {
  title: string;
  rewards: {
    count: number;
    amount: number;
    description: string;
  }[];
}

interface RewardStructurePortalProps {
  onClose: () => void;
}

export function RewardStructurePortal({ onClose }: RewardStructurePortalProps) {
  const rewardStructure: RewardCategory[] = [
    {
      title: "Giải cá nhân",
      rewards: [
        { count: 1, amount: 1000000, description: "giải Nhất" },
        { count: 2, amount: 500000, description: "giải Nhì" },
        { count: 3, amount: 300000, description: "giải Ba" },
        { count: 10, amount: 150000, description: "giải Khuyến Khích" },
      ],
    },
    {
      title: "Giải tập thể",
      rewards: [
        {
          count: 1,
          amount: 500000,
          description: "giải đơn vị có số lượng người tham gia dự thi đông nhất",
        },
      ],
    },
  ];

  return (
    <Portal>
      <PortalContent position="center" onClose={onClose} className="w-full max-w-2xl p-4">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">Cơ cấu giải thưởng</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {rewardStructure.map((category) => (
                <div key={category.title} className="space-y-3">
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                  <div className="space-y-2">
                    {category.rewards.map((reward) => (
                      <div key={reward.description} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{reward.count} {reward.description}</span>
                        </div>
                        <div className="text-primary font-semibold">
                          {reward.amount.toLocaleString()}đ
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 flex justify-end">
            <CustomButton onClick={onClose} variant="outline">
              Đóng
            </CustomButton>
          </div>
        </Card>
      </PortalContent>
    </Portal>
  );
}
