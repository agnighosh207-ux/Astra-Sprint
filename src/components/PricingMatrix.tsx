import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Localization from 'expo-localization';
import { Colors } from '../constants/Colors';

type Currency = 'INR' | 'USD';
type BillingCycle = 'monthly' | 'annually';

const TIERS = [
  {
    id: 'scout',
    name: 'Scout',
    tagline: 'Basic Operations',
    basePrice: { INR: 0, USD: 0 },
    features: ['Basic GPS tracking', 'Standard Leaderboard access'],
    popular: false,
  },
  {
    id: 'elite',
    name: 'Elite Operative',
    tagline: 'The Core Product',
    basePrice: { INR: 149, USD: 4.99 },
    features: ['Unlimited AI-Generated Missions', 'Advanced Biometric Storytelling', 'Safehouse Strength Modules', 'Priority Faction Support'],
    popular: true,
  },
  {
    id: 'mythic',
    name: 'Mythic Legend',
    tagline: 'The Whale Tier',
    basePrice: { INR: 199, USD: 9.99 },
    features: ['Everything in Elite', 'Custom Voice cloning (play as yourself)', 'Premium Mythic Relics', 'Private Developer Discord'],
    popular: false,
  }
];

export default function PricingMatrix() {
  const defaultCurrency = Localization.getLocales()[0]?.currencyCode === 'INR' ? 'INR' : 'USD';
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  const [cycle, setCycle] = useState<BillingCycle>('monthly');

  const isAnnually = cycle === 'annually';

  const getPriceDetails = (basePrice: number) => {
    if (basePrice === 0) return { displayPerMonth: 0, totalBilled: 0, originalTotal: 0 };
    
    const discountedMonthly = isAnnually ? basePrice * 0.8 : basePrice;
    const totalBilled = discountedMonthly * (isAnnually ? 12 : 1);
    
    return {
      displayPerMonth: discountedMonthly % 1 === 0 ? discountedMonthly : parseFloat(discountedMonthly.toFixed(2)),
      totalBilled: totalBilled % 1 === 0 ? totalBilled : parseFloat(totalBilled.toFixed(2)),
      originalTotal: (basePrice * (isAnnually ? 12 : 1)).toFixed(2)
    };
  };

  const currencySymbol = currency === 'INR' ? '₹' : '$';

  return (
    <View style={styles.container}>
      
      {/* Toggles Container */}
      <View style={styles.togglesWrapper}>
        <View style={styles.currencyToggle}>
          <TouchableOpacity onPress={() => setCurrency('USD')} style={[styles.currencyBtn, currency === 'USD' && styles.currencyBtnActive]}>
            <Text style={[styles.currencyText, currency === 'USD' && styles.currencyTextActive]}>USD</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrency('INR')} style={[styles.currencyBtn, currency === 'INR' && styles.currencyBtnActive]}>
            <Text style={[styles.currencyText, currency === 'INR' && styles.currencyTextActive]}>INR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cycleToggle}>
          <TouchableOpacity onPress={() => setCycle('monthly')} style={[styles.cycleBtn, !isAnnually && styles.cycleBtnActive]}>
            <Text style={[styles.cycleText, !isAnnually && styles.cycleTextActive]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCycle('annually')} style={[styles.cycleBtn, isAnnually && styles.cycleBtnActive]}>
            <Text style={[styles.cycleText, isAnnually && styles.cycleTextActive]}>Billed Annually</Text>
          </TouchableOpacity>
        </View>
        
        {isAnnually && (
          <View style={styles.saveBadge}>
            <Text style={styles.saveBadgeText}>SAVE 20%</Text>
          </View>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tiersContainer}>
        {TIERS.map(tier => {
          const base = tier.basePrice[currency];
          const { displayPerMonth, totalBilled, originalTotal } = getPriceDetails(base);

          return (
            <View key={tier.id} style={[styles.cardWrapper, tier.popular && styles.cardWrapperPopular]}>
              {tier.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                </View>
              )}
              
              <LinearGradient
                colors={tier.popular ? ['rgba(0, 255, 255, 0.1)', 'rgba(0, 255, 255, 0.02)'] : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.01)']}
                style={[styles.tierCard, tier.popular && styles.tierCardPopular]}
              >
                <Text style={styles.tierName}>{tier.name}</Text>
                <Text style={styles.tierTagline}>{tier.tagline}</Text>

                <View style={styles.priceContainer}>
                  <Text style={styles.priceSymbol}>{currencySymbol}</Text>
                  <Text style={styles.priceAmount}>{displayPerMonth}</Text>
                  <Text style={styles.priceCycle}>/mo</Text>
                </View>

                {base > 0 && isAnnually && (
                  <View style={styles.billingSubtext}>
                    <Text style={styles.strikePrice}>{currencySymbol}{originalTotal}</Text>
                    <Text style={styles.billedPrice}> Billed {currencySymbol}{totalBilled} yearly</Text>
                  </View>
                )}
                {base > 0 && !isAnnually && (
                  <View style={{height: 20}} />
                )}

                <TouchableOpacity style={[styles.ctaBtn, tier.popular && styles.ctaBtnPopular]}>
                  <Text style={[styles.ctaBtnText, tier.popular && styles.ctaBtnTextPopular]}>
                    {base === 0 ? "START FREE" : "SECURE UPGRADE"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.featuresList}>
                  {tier.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={18} color={tier.popular ? Colors.info : Colors.success} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center' },
  togglesWrapper: { width: '100%', alignItems: 'center', marginBottom: 30 },
  currencyToggle: { flexDirection: 'row', backgroundColor: Colors.card, borderRadius: 20, padding: 4, marginBottom: 15, borderWidth: 1, borderColor: Colors.border },
  currencyBtn: { paddingVertical: 6, paddingHorizontal: 20, borderRadius: 16 },
  currencyBtnActive: { backgroundColor: Colors.border },
  currencyText: { color: Colors.textMuted, fontWeight: 'bold' },
  currencyTextActive: { color: Colors.text },
  
  cycleToggle: { flexDirection: 'row', backgroundColor: Colors.card, borderRadius: 25, padding: 5, borderWidth: 1, borderColor: Colors.border },
  cycleBtn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
  cycleBtnActive: { backgroundColor: Colors.success },
  cycleText: { color: Colors.textMuted, fontSize: 13, fontWeight: 'bold' },
  cycleTextActive: { color: '#FFF' },
  
  saveBadge: { backgroundColor: Colors.success, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginTop: -10, zIndex: 2 },
  saveBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },

  tiersContainer: { paddingHorizontal: 10, paddingBottom: 30 },
  cardWrapper: { width: 280, marginRight: 20, position: 'relative', marginTop: 15 },
  cardWrapperPopular: { transform: [{ scale: 1.05 }], zIndex: 10, marginRight: 25, marginLeft: 5 },
  popularBadge: { position: 'absolute', top: -12, alignSelf: 'center', backgroundColor: Colors.info, paddingHorizontal: 15, paddingVertical: 4, borderRadius: 12, zIndex: 2, shadowColor: Colors.info, shadowOpacity: 0.8, shadowRadius: 10 },
  popularBadgeText: { color: '#000', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  
  tierCard: { borderRadius: 16, padding: 25, borderColor: 'rgba(255, 255, 255, 0.1)', borderWidth: 1, minHeight: 450 },
  tierCardPopular: { borderColor: Colors.info, borderWidth: 2, shadowColor: Colors.info, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  
  tierName: { color: Colors.text, fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  tierTagline: { color: Colors.textMuted, fontSize: 12, marginTop: 4, marginBottom: 20 },
  
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 5 },
  priceSymbol: { color: Colors.info, fontSize: 24, fontWeight: 'bold' },
  priceAmount: { color: Colors.text, fontSize: 42, fontWeight: '900', letterSpacing: -1 },
  priceCycle: { color: Colors.textMuted, fontSize: 16, marginLeft: 2 },
  
  billingSubtext: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' },
  strikePrice: { color: Colors.textDim, textDecorationLine: 'line-through', fontSize: 12, marginRight: 5 },
  billedPrice: { color: Colors.success, fontSize: 12, fontWeight: 'bold' },

  ctaBtn: { backgroundColor: Colors.border, paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginBottom: 25, marginTop: 10 },
  ctaBtnPopular: { backgroundColor: Colors.info },
  ctaBtnText: { color: '#FFF', fontWeight: 'bold', letterSpacing: 1 },
  ctaBtnTextPopular: { color: '#000', fontWeight: '900' },

  featuresList: { flex: 1 },
  featureItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  featureText: { color: '#E2E8F0', fontSize: 13, marginLeft: 10, flex: 1, lineHeight: 18 },
});
