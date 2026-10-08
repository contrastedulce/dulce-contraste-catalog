import { Recipe, MasterCosts } from '../types';
import { safeNum } from './utils';

function getServiceRate(s: { monthly: number; usagePercent: number }): number {
  return ((s.monthly * (s.usagePercent / 100)) / 240) / 60;
}

export interface RecipeBreakdown {
  totalCost: number;
  costPerUnit: number;
  laborCost: number;
  servicesCost: number;
  extraCost: number;
  suppliesCost: number;
  suggestedPrice: number;
}

export function getRecipeBreakdown(
  recipe: Recipe,
  totalCost: number,
  masterCosts: MasterCosts | undefined,
  defaultMargin = 30,
): RecipeBreakdown {
  const yieldVal = recipe.yield || 1;
  const costPerUnit = totalCost / yieldVal;

  const mc = masterCosts;

  const heavyRate = mc ? (mc.salaries.heavy.monthly / mc.salaries.heavy.hoursPerMonth) / 60 : 0;
  const lightRate = mc ? (mc.salaries.light.monthly / mc.salaries.light.hoursPerMonth) / 60 : 0;

  const laborCost = mc
    ? safeNum(recipe.laborMinutes?.heavy) * heavyRate + safeNum(recipe.laborMinutes?.light) * lightRate
    : 0;

  const servicesCost = mc
    ? safeNum(recipe.serviceMinutes?.electricity) * getServiceRate(mc.services.electricity) +
      safeNum(recipe.serviceMinutes?.water) * getServiceRate(mc.services.water) +
      safeNum(recipe.serviceMinutes?.gas) * getServiceRate(mc.services.gas) +
      safeNum(recipe.serviceMinutes?.machinery) * getServiceRate(mc.services.machinery) +
      safeNum(recipe.serviceMinutes?.utensils) * getServiceRate(mc.services.utensils)
    : 0;

  const extraCost = safeNum(recipe.extraCosts?.biosecurity) + safeNum(recipe.extraCosts?.packaging);
  const suppliesCost = Math.max(0, totalCost - laborCost - servicesCost - extraCost);

  const taxTotal = (mc?.taxes.igv || 0) + (mc?.taxes.salesTax || 0);
  const suggestedPrice = costPerUnit / (1 - defaultMargin / 100 - taxTotal / 100);

  return {
    totalCost,
    costPerUnit,
    laborCost,
    servicesCost,
    extraCost,
    suppliesCost,
    suggestedPrice,
  };
}
