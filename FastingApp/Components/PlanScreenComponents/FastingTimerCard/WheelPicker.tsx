import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export const PICKER_ITEM_H = 48;
export const PICKER_VISIBLE = 5;

export interface WheelPickerRef {
  scrollToIndex: (index: number, animated?: boolean) => void;
}

interface Props {
  items: string[];
  initialIndex?: number;
  onChange: (index: number) => void;
}

export const WheelPicker = forwardRef<WheelPickerRef, Props>(
  ({ items, initialIndex = 0, onChange }, ref) => {
    const scrollRef = useRef<ScrollView>(null);
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const activeRef = useRef(initialIndex);

    useImperativeHandle(ref, () => ({
      scrollToIndex: (index, animated = true) => {
        activeRef.current = index;
        setActiveIndex(index);
        scrollRef.current?.scrollTo({ y: index * PICKER_ITEM_H, animated });
      },
    }));

    useEffect(() => {
      const t = setTimeout(() => {
        scrollRef.current?.scrollTo({ y: initialIndex * PICKER_ITEM_H, animated: false });
      }, 50);
      return () => clearTimeout(t);
    }, []);

    const handleEnd = (e: any) => {
      const idx = Math.max(0, Math.min(
        Math.round(e.nativeEvent.contentOffset.y / PICKER_ITEM_H),
        items.length - 1,
      ));
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActiveIndex(idx);
        onChange(idx);
      }
    };

    return (
      <View style={{ height: PICKER_ITEM_H * PICKER_VISIBLE, overflow: 'hidden' }}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={PICKER_ITEM_H}
          decelerationRate="fast"
          contentContainerStyle={{ paddingVertical: PICKER_ITEM_H * 2 }}
          onMomentumScrollEnd={handleEnd}
          onScrollEndDrag={handleEnd}
        >
          {items.map((label, i) => {
            const active = i === activeIndex;
            return (
              <View key={i} style={{ height: PICKER_ITEM_H, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{
                  fontSize: active ? 17 : 14,
                  fontWeight: active ? '700' : '400',
                  color: active ? '#1A1A1A' : '#C8C8C8',
                }}>
                  {label}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
);

WheelPicker.displayName = 'WheelPicker';
