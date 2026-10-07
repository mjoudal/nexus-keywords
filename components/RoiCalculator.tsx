import React, { useState } from 'react';

interface Props {
  initialKeyword?: string;
  initialVolume?: number;
  initialCpc?: number;
}

// Typical Organic SERP CTR benchmark curves
const CTR_BY_POSITION: Record<number, number> = {
  1: 0.34, // 34%
  2: 0.16, // 16%
  3: 0.10, // 10%
  4: 0.07, // 7%
  5: 0.05, // 5%
  6: 0.035, // 3.5%
  7: 0.025, // 2.5%
  8: 0.02, // 2%
  9: 0.015, // 1.5%
  10: 0.01, // 1%
};

const RoiCalculator: React.FC<Props> = ({
  initialKeyword = 'cloud erp software',
  initialVolume = 12500,
  initialCpc = 3.5,
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [volume, setVolume] = useState(initialVolume);
  const [targetRank, setTargetRank] = useState(1);
  const [cpc, setCpc] = useState(initialCpc);
  const [conversionRate, setConversionRate] = useState(2.5); // 2.5%
  const [aov, setAov] = useState(150); // $150 average transaction / lead value

  const currentCtr = CTR_BY_POSITION[targetRank] || 0.1;
  const monthlyClicks = Math.round(volume * currentCtr);
  const annualClicks = monthlyClicks * 12;

  const monthlyConversions = Math.round(monthlyClicks * (conversionRate / 100));
  const annualConversions = monthlyConversions * 12;

  const monthlyRevenue = monthlyConversions * aov;
  const annualRevenue = monthlyRevenue * 12;

  const monthlyAdSavings = Math.round(monthlyClicks * cpc);
  const annualAdSavings = monthlyAdSavings * 12;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
            Organic ROI Simulator
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">SEO Traffic &amp; Revenue Projection Model</h2>
          <p className="text-xs text-slate-500 mt-1">
            Estimate monthly visits, sales, and annual bottom-line value gained from ranking on Page 1 of Google.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Parameters Form */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5 lg:col-span-1">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
            Model Parameters
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Target Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 uppercase mb-1.5">
              <span>Monthly Search Volume</span>
              <span className="text-indigo-600 font-extrabold">{volume.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={500}
              max={150000}
              step={500}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 uppercase mb-1.5">
              <span>Target SERP Position</span>
              <span className="text-indigo-600 font-extrabold">Rank #{targetRank} ({(currentCtr * 100).toFixed(0)}% CTR)</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((pos) => (
                <button
                  key={pos}
                  onClick={() => setTargetRank(pos)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    targetRank === pos
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  #{pos}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 uppercase mb-1.5">
              <span>Est. CPC (Paid Ads Benchmark)</span>
              <span className="text-emerald-600 font-extrabold">${cpc.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={25}
              step={0.5}
              value={cpc}
              onChange={(e) => setCpc(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 uppercase mb-1.5">
              <span>Conversion Rate (%)</span>
              <span className="text-indigo-600 font-extrabold">{conversionRate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={10}
              step={0.1}
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 uppercase mb-1.5">
              <span>Customer Value / AOV ($)</span>
              <span className="text-indigo-600 font-extrabold">${aov.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={20}
              max={2000}
              step={20}
              value={aov}
              onChange={(e) => setAov(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Projected Financial Outcome Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Annual Projected Organic Revenue
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white">
                ${annualRevenue.toLocaleString()}
              </div>
              <div className="mt-3 text-xs text-indigo-200">
                ${monthlyRevenue.toLocaleString()} / month in direct organic conversions
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                Annual Paid Ad Spend Value Saved
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white">
                ${annualAdSavings.toLocaleString()}
              </div>
              <div className="mt-3 text-xs text-emerald-200">
                Equivalent Google Ads cost at ${cpc.toFixed(2)} CPC
              </div>
            </div>
          </div>

          {/* Operational Metrics Breakdown */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Operational Traffic &amp; Conversion Breakdown
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Monthly Visits</span>
                <div className="text-xl font-bold text-slate-900 mt-1">{monthlyClicks.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">at {(currentCtr * 100).toFixed(0)}% CTR</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Annual Visits</span>
                <div className="text-xl font-bold text-slate-900 mt-1">{annualClicks.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">qualified organic clicks</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Monthly Sales</span>
                <div className="text-xl font-bold text-indigo-600 mt-1">{monthlyConversions.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">at {conversionRate}% conv.</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Annual Sales</span>
                <div className="text-xl font-bold text-indigo-600 mt-1">{annualConversions.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">closed transactions</div>
              </div>
            </div>

            <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100 text-xs text-slate-700 leading-relaxed space-y-2">
              <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                <span>✦ Strategic Recommendation for &ldquo;{keyword}&rdquo;:</span>
              </div>
              <p>
                Ranking in Position #{targetRank} delivers approx <strong>{monthlyClicks.toLocaleString()} organic visits/month</strong>. Even with modest conversion rates, the organic link equity pays for itself 10x compared to recurring paid search campaigns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoiCalculator;
