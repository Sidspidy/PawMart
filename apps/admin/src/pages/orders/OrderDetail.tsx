import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, NavLink } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingBag, Truck, Calendar, MapPin, 
  User, Mail, Phone, Tag, ShieldCheck, CheckCircle2 
} from 'lucide-react';

const TIMELINE_STEPS = [
  { id: 1, title: 'Order Placed', time: 'May 28, 10:14 AM', completed: true, active: false, icon: '📝' },
  { id: 2, title: 'Payment Confirmed', time: 'May 28, 10:15 AM', completed: true, active: false, icon: '💳' },
  { id: 3, title: 'Dispatched from Warehouse', time: 'May 28, 02:30 PM', completed: true, active: true, icon: '📦' },
  { id: 4, title: 'In Transit', time: 'Pending carrier scans', completed: false, active: false, icon: '🚚' },
  { id: 5, title: 'Out for Delivery / Arrival', time: 'Est: May 30, 2026', completed: false, active: false, icon: '🏠' },
];

export default function OrderDetail() {
  const { id = 'PW-9801' } = useParams();
  const [currentStep, setCurrentStep] = useState(3);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12 max-w-5xl mx-auto"
    >
      {/* HEADER BAR */}
      <div className="flex items-center gap-3">
        <NavLink 
          to="/orders"
          className="p-3 bg-white hover:bg-violet-50 text-[#705e8c] border border-violet-100 rounded-full flex items-center justify-center shadow-soft"
        >
          <ArrowLeft size={16} />
        </NavLink>
        <div>
          <h2 className="text-2xl font-extrabold text-[#3d2c54] flex items-center gap-2">
            Inspection: {id}
          </h2>
          <p className="text-xs text-[#705e8c]">Detailed overview of checkout purchases and dispatch timeline</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: INTERACTIVE VISUAL TIMELINE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft space-y-6">
            <h3 className="font-extrabold text-sm text-[#3d2c54] flex items-center gap-2 border-b border-violet-100/60 pb-3">
              <Truck size={16} className="text-violet-500" />
              Realtime Shipping Milestones
            </h3>

            {/* TIMELINE TIMELINE CONSTRUCT */}
            <div className="relative pl-8 space-y-6">
              
              {/* Vertical connecting line */}
              <div className="absolute left-[13px] top-2 bottom-2 w-1 bg-violet-100 rounded-full" />
              
              {/* Active filled line part */}
              <div 
                className="absolute left-[13px] top-2 w-1 bg-gradient-to-b from-violet-500 to-violet-300 rounded-full"
                style={{ height: '55%' }}
              />

              {TIMELINE_STEPS.map((step, i) => (
                <div key={step.id} className="relative flex gap-4">
                  {/* Indicator Dot */}
                  <div className={`
                    absolute left-[-31px] w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-10 border-2
                    ${step.completed 
                      ? 'bg-violet-600 border-white text-white' 
                      : step.active 
                        ? 'bg-white border-violet-500 text-violet-600 animate-pulse' 
                        : 'bg-white border-violet-100 text-[#9f8fb3]'}
                  `}>
                    {step.completed ? '✓' : step.id}
                  </div>

                  {/* Step Description */}
                  <div className={`
                    flex-1 p-4 rounded-[22px] border transition-all duration-300
                    ${step.active 
                      ? 'bg-white/80 border-violet-200 shadow-sm' 
                      : 'bg-white/30 border-transparent'}
                  `}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-[#3d2c54] flex items-center gap-1.5">
                        <span>{step.icon}</span>
                        {step.title}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${step.completed ? 'bg-green-50 text-green-500' : 'bg-violet-50 text-violet-500'}`}>
                        {step.completed ? 'Done' : 'Pending'}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#705e8c] mt-1 block font-medium">
                      {step.time}
                    </span>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* CHECKOUT PRODUCTS LIST CARD */}
          <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft space-y-4">
            <h3 className="font-extrabold text-sm text-[#3d2c54] flex items-center gap-2">
              <ShoppingBag size={16} className="text-orange-400" />
              Receipt Items Summary
            </h3>

            <div className="divide-y divide-violet-100/40">
              
              {/* Product row 1 */}
              <div className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-xl font-bold">🦴</div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#3d2c54]">Golden Bone Chew</h4>
                    <span className="text-[10px] text-[#705e8c] font-bold block mt-0.5">Category: Dogs • 1 Unit</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#3d2c54]">$14.99</span>
              </div>

              {/* Product row 2 */}
              <div className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center text-xl font-bold">🐟</div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#3d2c54]">Tuna Purrfection Pack</h4>
                    <span className="text-[10px] text-[#705e8c] font-bold block mt-0.5">Category: Cats • 2 Units</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#3d2c54]">$17.98</span>
              </div>

              {/* Financial Subtotals */}
              <div className="pt-4 space-y-1.5 text-xs font-bold text-[#705e8c]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-[#3d2c54]">$32.97</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Handling:</span>
                  <span className="text-[#3d2c54]">$1.50</span>
                </div>
                <div className="flex justify-between border-t border-violet-100 pt-3 text-sm font-extrabold text-[#3d2c54]">
                  <span>Total cost charged:</span>
                  <span className="text-violet-600">$34.47</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED CUSTOMER INFO */}
        <div className="space-y-6">
          
          {/* CUSTOMER CARD */}
          <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft space-y-4">
            <h3 className="font-extrabold text-sm text-[#3d2c54] flex items-center gap-2 border-b border-violet-100/60 pb-3">
              <User size={16} className="text-orange-400" />
              Customer Profile
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e7c6ff] flex items-center justify-center text-md font-bold">👩</div>
              <div>
                <h4 className="text-xs font-extrabold text-[#3d2c54]">Ava Mitchell</h4>
                <span className="text-[9px] font-bold text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  Gold Paw Member
                </span>
              </div>
            </div>

            {/* Profile specifications */}
            <div className="space-y-3 text-xs font-bold text-[#705e8c] pt-2">
              <div className="flex gap-2">
                <Mail size={14} className="text-[#9f8fb3] mt-0.5 shrink-0" />
                <span className="truncate">ava.mitchell@gmail.com</span>
              </div>
              <div className="flex gap-2">
                <Phone size={14} className="text-[#9f8fb3] mt-0.5 shrink-0" />
                <span>+1 (555) 349-9801</span>
              </div>
              <div className="flex gap-2">
                <MapPin size={14} className="text-[#9f8fb3] mt-0.5 shrink-0" />
                <span className="leading-relaxed">842 Whisper Lane,<br />Gold Coast, QLD 4217</span>
              </div>
            </div>

            {/* Pet Preference Highlights */}
            <div className="p-3 bg-[#e2f0cb]/40 border border-[#e2f0cb]/50 rounded-2xl flex items-start gap-2">
              <span className="text-md mt-0.5">🐕</span>
              <div>
                <span className="text-[10px] font-extrabold text-[#3d2c54] block">Pet preference</span>
                <span className="text-[9px] text-emerald-600 font-extrabold mt-0.5 inline-block">
                  Dogs (Golden Retriever lover)
                </span>
              </div>
            </div>
          </div>

          {/* SHIPPING LOGISTICS */}
          <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft space-y-4">
            <h3 className="font-extrabold text-sm text-[#3d2c54] flex items-center gap-2 border-b border-violet-100/60 pb-3">
              <ShieldCheck size={16} className="text-emerald-500" />
              Dispatch Logistics
            </h3>

            <div className="space-y-3 text-xs font-bold text-[#705e8c]">
              <div>
                <span className="text-[10px] text-[#9f8fb3] block mb-1">Carrier logistics</span>
                <span className="text-[#3d2c54]">FedEx PetPriority Express</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9f8fb3] block mb-1">Tracking number</span>
                <span className="text-violet-600 select-all font-mono">FX-PET-9801-4428</span>
              </div>
            </div>

            <button className="w-full py-2.5 bg-violet-600 text-white rounded-full font-bold text-xs shadow-md hover:scale-101 transition-transform cursor-pointer">
              Print Shipping Label
            </button>
          </div>

        </div>

      </div>

    </motion.div>
  );
}
