import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WheelPicker, PICKER_ITEM_H, PICKER_VISIBLE } from './WheelPicker';
import { PlanColors } from '../../../Theme/colors';

// ── Constants ────────────────────────────────────────────────────────────────

const TR_MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const TR_DAYS   = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const PAST_DAYS   = 7;
const FUTURE_DAYS = 2;
const TODAY_IDX   = PAST_DAYS;

const HIGHLIGHT_TOP = PICKER_ITEM_H * Math.floor(PICKER_VISIBLE / 2);

// Built once at module load (same pattern as StartTimeModal)
function buildDateOptions(): Date[] {
  return Array.from({ length: PAST_DAYS + FUTURE_DAYS + 1 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - PAST_DAYS + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

const DATE_OPTIONS = buildDateOptions();

function dateLabel(d: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d.getTime() === today.getTime()) return 'Bugün';
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.getTime() === yesterday.getTime()) return 'Dün';
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${TR_DAYS[d.getDay()]}`;
}

const DATE_LABELS = DATE_OPTIONS.map(dateLabel);

function findDateIndex(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const idx = DATE_OPTIONS.findIndex(o => o.getTime() === d.getTime());
  return idx >= 0 ? idx : TODAY_IDX;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDuration(ms: number): string {
  if (ms <= 0) return '0 dk';
  const totalMins = Math.floor(ms / 60000);
  const hours = Math.floor(totalMins / 60);
  const mins  = totalMins % 60;
  if (hours > 0 && mins > 0) return `${hours} sa ${mins} dk`;
  if (hours > 0) return `${hours} sa`;
  return `${mins} dk`;
}

function formatDayTime(d: Date): string {
  const label = dateLabel(d);
  const time  = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${label}, ${time}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ErrorBox({ message }: { message: string }) {
  return (
    <View style={styles.errorBox}>
      <Ionicons name="alert-circle-outline" size={15} color="#E53935" style={{ marginTop: 1 }} />
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

// ── Inline picker (shared layout) ─────────────────────────────────────────────

function InlinePicker({
  pickerKey,
  dateIdx,
  hourIdx,
  minuteIdx,
  onDateChange,
  onHourChange,
  onMinuteChange,
}: {
  pickerKey: string;
  dateIdx: number;
  hourIdx: number;
  minuteIdx: number;
  onDateChange: (i: number) => void;
  onHourChange: (i: number) => void;
  onMinuteChange: (i: number) => void;
}) {
  return (
    // key forces remount when switching fields so WheelPicker reinitialises
    <View key={pickerKey} style={styles.pickersWrapper}>
      <View pointerEvents="none" style={[styles.highlightBand, { top: HIGHLIGHT_TOP }]} />
      <View style={{ flex: 3 }}>
        <WheelPicker items={DATE_LABELS} initialIndex={dateIdx}   onChange={onDateChange} />
      </View>
      <View style={{ flex: 1 }}>
        <WheelPicker items={HOURS}       initialIndex={hourIdx}   onChange={onHourChange} />
      </View>
      <View style={{ flex: 1 }}>
        <WheelPicker items={MINUTES}     initialIndex={minuteIdx} onChange={onMinuteChange} />
      </View>
    </View>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  visible:    boolean;
  onClose:    () => void;                 // Back — continue fasting
  onDelete:   () => void;                 // Sil — discard fast → READY
  onSave:     (startTime: Date, endTime: Date) => void;
  startedAt:  Date;
  planLabel:  string;
  planColors: PlanColors;
  goalHours:  number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function EndFastModal({
  visible,
  onClose,
  onDelete,
  onSave,
  startedAt,
  planLabel,
  planColors,
  goalHours,
}: Props) {
  const insets = useSafeAreaInsets();

  type Field = 'start' | 'end';
  const [editingField, setEditingField] = useState<Field>('end');

  // Start time picker state
  const [startDateIdx,   setStartDateIdx]   = useState(() => findDateIndex(startedAt));
  const [startHourIdx,   setStartHourIdx]   = useState(() => startedAt.getHours());
  const [startMinuteIdx, setStartMinuteIdx] = useState(() => startedAt.getMinutes());

  // End time picker state (defaults to now)
  const [endDateIdx,   setEndDateIdx]   = useState(TODAY_IDX);
  const [endHourIdx,   setEndHourIdx]   = useState(() => new Date().getHours());
  const [endMinuteIdx, setEndMinuteIdx] = useState(() => new Date().getMinutes());

  // Re-initialise every time the modal opens
  useEffect(() => {
    if (!visible) return;
    const now = new Date();
    setEditingField('end');
    setStartDateIdx(findDateIndex(startedAt));
    setStartHourIdx(startedAt.getHours());
    setStartMinuteIdx(startedAt.getMinutes());
    setEndDateIdx(TODAY_IDX);
    setEndHourIdx(now.getHours());
    setEndMinuteIdx(now.getMinutes());
  }, [visible]);

  // ── Derived values ──────────────────────────────────────────────────────────

  const selectedStart = (() => {
    const d = new Date(DATE_OPTIONS[startDateIdx]);
    d.setHours(startHourIdx, startMinuteIdx, 0, 0);
    return d;
  })();

  const selectedEnd = (() => {
    const d = new Date(DATE_OPTIONS[endDateIdx]);
    d.setHours(endHourIdx, endMinuteIdx, 0, 0);
    return d;
  })();

  const now = new Date();

  const startError: string | null =
    selectedStart > now
      ? 'Başlangıç zamanı, geçerli zamandan daha sonra olamaz.'
      : null;

  const endError: string | null =
    selectedEnd > now
      ? 'Bitiş zamanı, geçerli zamandan sonra olamaz.'
      : selectedEnd <= selectedStart
      ? 'Bitiş saati başlangıçtan önce veya eşit olamaz.'
      : null;

  const canSave     = !startError && !endError;
  const durationMs  = selectedEnd.getTime() - selectedStart.getTime();
  const durationStr = formatDuration(durationMs);

  // ── Pencil-icon colour helpers ──────────────────────────────────────────────

  const pencilColor = (field: Field) =>
    editingField === field ? planColors.accent : '#C8C8C8';

  const timeColor = (field: Field) => {
    const err = field === 'start' ? startError : endError;
    if (err) return '#E53935';
    return field === 'end' ? planColors.accent : '#1A1A1A';
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.root, { paddingTop: insets.top }]}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerIcon} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Orucu Bitir</Text>
          <View style={styles.headerIcon} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        >

          {/* Duration hero */}
          <View style={styles.heroSection}>
            <Text style={styles.heroLabel}>TOPLAM ORUÇ SÜRESİ</Text>
            <Text style={[styles.heroValue, { color: canSave ? planColors.accent : '#BBBBBB' }]}>
              {durationStr}
            </Text>
          </View>

          {/* Summary card */}
          <View style={styles.card}>

            {/* Plan row */}
            <View style={styles.planRow}>
              <View style={[styles.planIconWrap, { backgroundColor: planColors.badge }]}>
                <Ionicons name="restaurant-outline" size={16} color={planColors.accent} />
              </View>
              <Text style={styles.planLabel}>{planLabel} · {goalHours} Saat</Text>
            </View>

            <View style={styles.divider} />

            {/* ── Başlangıç row ── */}
            <TouchableOpacity
              style={styles.timeRow}
              onPress={() => setEditingField('start')}
              activeOpacity={0.7}
            >
              <View style={[styles.dot, { backgroundColor: planColors.accent }]} />
              <Text style={styles.timeRowLabel}>Başlangıç</Text>
              <Text style={[styles.timeRowValue, { color: timeColor('start') }]}>
                {formatDayTime(selectedStart)}
              </Text>
              <Ionicons name="create-outline" size={17} color={pencilColor('start')} />
            </TouchableOpacity>

            {/* Picker + error for start — appears inline below start row */}
            {editingField === 'start' && (
              <>
                {startError && <ErrorBox message={startError} />}
                <InlinePicker
                  pickerKey="start"
                  dateIdx={startDateIdx}
                  hourIdx={startHourIdx}
                  minuteIdx={startMinuteIdx}
                  onDateChange={setStartDateIdx}
                  onHourChange={setStartHourIdx}
                  onMinuteChange={setStartMinuteIdx}
                />
                <Text style={styles.note}>* Orucu başladığınız zamanı seçin</Text>
              </>
            )}

            <View style={styles.divider} />

            {/* ── Bitiş row ── */}
            <TouchableOpacity
              style={styles.timeRow}
              onPress={() => setEditingField('end')}
              activeOpacity={0.7}
            >
              <View style={[styles.dot, { backgroundColor: '#F0963A' }]} />
              <Text style={styles.timeRowLabel}>Bitiş</Text>
              <Text style={[styles.timeRowValue, { color: timeColor('end'), fontWeight: '700' }]}>
                {formatDayTime(selectedEnd)}
              </Text>
              <Ionicons name="create-outline" size={17} color={pencilColor('end')} />
            </TouchableOpacity>

            {/* Picker + error for end — appears inline below end row */}
            {editingField === 'end' && (
              <>
                {endError && <ErrorBox message={endError} />}
                <InlinePicker
                  pickerKey="end"
                  dateIdx={endDateIdx}
                  hourIdx={endHourIdx}
                  minuteIdx={endMinuteIdx}
                  onDateChange={setEndDateIdx}
                  onHourChange={setEndHourIdx}
                  onMinuteChange={setEndMinuteIdx}
                />
                <Text style={styles.note}>
                  * Orucu bitirdiğiniz (yemeye başladığınız) zamanı seçin
                </Text>
              </>
            )}

          </View>

          {/* Action buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.deleteBtn} onPress={onDelete} activeOpacity={0.8}>
              <Text style={styles.deleteBtnText}>Sil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveBtn,
                { backgroundColor: canSave ? planColors.accent : '#C8C8C8' },
              ]}
              onPress={() => canSave && onSave(selectedStart, selectedEnd)}
              activeOpacity={canSave ? 0.85 : 1}
            >
              <Text style={styles.saveBtnText}>Kaydet</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F2EE',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.2,
  },

  // Scroll
  scroll: {
    paddingHorizontal: 20,
    gap: 16,
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  heroValue: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 60,
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 14,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F2',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timeRowLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    flex: 1,
  },
  timeRowValue: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Error box
  errorBox: {
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#E53935',
    fontWeight: '500',
    lineHeight: 18,
  },

  // Picker
  pickersWrapper: {
    flexDirection: 'row',
    position: 'relative',
    height: PICKER_ITEM_H * PICKER_VISIBLE,
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
  note: {
    fontSize: 12,
    color: '#AAAAAA',
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // Buttons
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  deleteBtn: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 18,
    backgroundColor: '#EBEBEB',
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  saveBtn: {
    flex: 2,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
