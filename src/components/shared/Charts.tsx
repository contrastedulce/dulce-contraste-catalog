import React, { Component } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ChartErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState;
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.props = props;
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 text-slate-400 p-6 text-center">
          <BarChart3 className="w-10 h-10 mb-3 opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Gráfico temporalmente<br/>no disponible</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const MemoizedLineChart = React.memo(({ data, color = "#f43f5e" }: any) => (
  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
    <LineChart data={data}>
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.1}/>
          <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
      <XAxis 
        dataKey="name" 
        axisLine={false} 
        tickLine={false} 
        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
        dy={10}
      />
      <YAxis 
        axisLine={false} 
        tickLine={false} 
        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
        tickFormatter={(value) => `$${value/1000}k`}
      />
      <Tooltip 
        contentStyle={{ 
          borderRadius: '20px', 
          border: 'none', 
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
          padding: '12px',
          fontWeight: 'bold'
        }}
        itemStyle={{ fontWeight: 'bold', color: color }}
      />
      <Line 
        type="monotone" 
        dataKey="sales" 
        stroke={color} 
        strokeWidth={4} 
        dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }}
        activeDot={{ r: 6, strokeWidth: 0 }}
      />
    </LineChart>
  </ResponsiveContainer>
));
