import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WheelPicker, WheelPickerRef, PICKER_ITEM_H, PICKER_VISIBLE } from './WheelPicker';

const TR_DAYS   = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const TR_MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

// Saat listesi: 00–23
const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
// Dakika listesi: 00–59
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

// 7 gün geçmiş + bugün + 2 gün ileri = 10 seçenek
const PAST_DAYS   = 7;
const FUTURE_DAYS = 2;
const TODAY_IDX   = PAST_DAYS; // bugünün index'i

function buildDateOptions(): Date[] {
  return Array.from({ length: PAST_DAYS + FUTURE_DAYS + 1 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - PAST_DAYS + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

function dateLabel(d: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d.getTime() === today.getTime()) return 'Bugün';
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${TR_DAYS[d.getDay()]}`;
}

const DATE_OPTIONS = buildDateOptions();
const DATE_LABELS  = DATE_OPTIONS.map(dateLabel);

// Seçili satırın picker içindeki y konumu
const HIGHLIGHT_TOP = PICKER_ITEM_H * Math.floor(PICKER_VISIBLE / 2); // 48 * 2 = 96

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (startTime: Date) => void;
  accentColor: string;
}

export function StartTimeModal({ visible, onClose, onConfirm, accentColor }: Props) {
  const insets = useSafeAreaInsets();

  const dateRef   = useRef<WheelPickerRef>(null);
  const hourRef   = useRef<WheelPickerRef>(null);
  const minuteRef = useRef<WheelPickerRef>(null);

  const [dateIdx,   setDateIdx]   = useState(TODAY_IDX);
  const [hourIdx,   setHourIdx]   = useState(() => new Date().getHours());
  const [minuteIdx, setMinuteIdx] = useState(() => new Date().getMinutes());

  // Modal her açıldığında şimdiki zamana sıfırla
  useEffect(() => {
    if (!visible) return;
    const n = new Date();
    setDateIdx(TODAY_IDX);
    setHourIdx(n.getHours());
    setMinuteIdx(n.getMinutes());
    setTimeout(() => {
      dateRef.current?.scrollToIndex(TODAY_IDX, false);
      hourRef.current?.scrollToIndex(n.getHours(), false);
      minuteRef.current?.scrollToIndex(n.getMinutes(), false);
    }, 80);
  }, [visible]);

  const handleConfirm = () => {
    const start = new Date(DATE_OPTIONS[dateIdx]);
    start.setHours(hourIdx, minuteIdx, 0, 0);
    onConfirm(start);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Arka plan — tıklanınca kapat */}
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>

          {/* Başlık + Kapat */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Oruca ne zaman başladın?</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* ── 3 Kolon: TARİH | SAAT | DAKİKA ── */}
          <View style={styles.pickersWrapper}>
            {/* Seçili satırı vurgulayan tek bant — tüm kolonları kapsar */}
            <View
              pointerEvents="none"
              style={[styles.highlightBand, { top: HIGHLIGHT_TOP }]}
            />

            {/* Tarih kolonu */}
            <View style={{ flex: 3 }}>
              <WheelPicker
                ref={dateRef}
                items={DATE_LABELS}
                initialIndex={TODAY_IDX}
                onChange={setDateIdx}
              />
            </View>

            {/* Saat kolonu */}
            <View style={{ flex: 1 }}>
              <WheelPicker
                ref={hourRef}
                items={HOURS}
                initialIndex={new Date().getHours()}
                onChange={setHourIdx}
              />
            </View>

            {/* Dakika kolonu */}
            <View style={{ flex: 1 }}>
              <WheelPicker
                ref={minuteRef}
                items={MINUTES}
                initialIndex={new Date().getMinutes()}
                onChange={setMinuteIdx}
              />
            </View>
          </View>

          {/* Kaydet butonu */}
          <TouchableOpacity
            onPress={handleConfirm}
            activeOpacity={0.88}
            style={[styles.confirmBtn, { backgroundColor: accentColor }]}
          >
            <Text style={styles.confirmBtnText}>Kaydet</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 28,
    paddingHorizontal: 20,
    gap: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.3,
    flex: 1,
    marginRight: 12,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '600',
  },
  pickersWrapper: {
    flexDirection: 'row',
    position: 'relative',
    height: PICKER_ITEM_H * PICKER_VISIBLE, // 48 * 5 = 240
  },
  highlightBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: PICKER_ITEM_H,
    backgroundColor: '#F2F2F2',
    borderRadius: 14,
    zIndex: 0,
  },
  confirmBtn: {
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
