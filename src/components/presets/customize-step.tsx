"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PackageGrid } from "./package-grid";
import { InspirationPicker } from "./inspiration-picker";
import { ScenePicker } from "./scene-picker";
import { StylePicker } from "./style-picker";
import { OutfitPicker } from "./outfit-picker";
import { MoodPicker } from "./mood-picker";
import { PhotoCountSlider } from "./photo-count-slider";
import { useCreationStore } from "@/stores/creation-store";

export function CustomizeStep() {
  const inspirationImage = useCreationStore((s) => s.inspirationImage);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">选择风格</h2>
        <p className="text-sm text-muted-foreground">
          三种方式任选其一
        </p>
      </div>

      <Tabs defaultValue="inspiration">
        <TabsList className="w-full">
          <TabsTrigger value="inspiration" className="flex-1">
            💡 灵感图
          </TabsTrigger>
          <TabsTrigger value="quick" className="flex-1">
            📦 预设套餐
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex-1">
            🎨 自定义
          </TabsTrigger>
        </TabsList>

        {/* Mode 1: Inspiration — upload a style ref, AI handles the rest */}
        <TabsContent value="inspiration" className="mt-4">
          <div className="flex flex-col gap-6">
            <InspirationPicker />

            {inspirationImage && (
              <div className="rounded-lg border border-green-200/50 bg-green-50/50 dark:border-green-900/30 dark:bg-green-950/20 p-3 text-xs text-muted-foreground">
                <p className="font-medium text-green-700 dark:text-green-400 mb-1">
                  已上传灵感图
                </p>
                <p>AI 会自动分析灵感图的构图、色调、光线、场景、服装和氛围，无需手动设置其他选项，直接点击"开始生成"即可。</p>
              </div>
            )}

            <Separator />

            <section>
              <h3 className="mb-3 text-base font-semibold">生成数量</h3>
              <PhotoCountSlider />
            </section>
          </div>
        </TabsContent>

        {/* Mode 2: Quick preset packages */}
        <TabsContent value="quick" className="mt-4">
          <PackageGrid />
        </TabsContent>

        {/* Mode 3: Fully custom settings */}
        <TabsContent value="custom" className="mt-4">
          <div className="flex flex-col gap-6">
            <section>
              <h3 className="mb-3 text-base font-semibold">场景</h3>
              <ScenePicker />
            </section>

            <Separator />

            <section>
              <h3 className="mb-3 text-base font-semibold">风格</h3>
              <StylePicker />
            </section>

            <Separator />

            <section>
              <h3 className="mb-3 text-base font-semibold">服装</h3>
              <OutfitPicker />
            </section>

            <Separator />

            <section>
              <h3 className="mb-3 text-base font-semibold">情绪</h3>
              <MoodPicker />
            </section>

            <Separator />

            <section>
              <h3 className="mb-3 text-base font-semibold">生成数量</h3>
              <PhotoCountSlider />
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
