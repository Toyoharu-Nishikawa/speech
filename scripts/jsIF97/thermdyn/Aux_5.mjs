/*******************************************************************/
/*ZPH_5(P,H,t,v,g,u,s,Cp,w)
/*  (given P and H calculate t and other properties in the region 5)
/*  (Newton method)
/*ZPS_5(P,S,t,v,g,u,h,Cp,w)
/*  (given P and S calculate t and other properties in the region 5)
/*  (Newton method)
/*******************************************************************/

import {region_5, Gibbs_5} from "./IF97_5.mjs"

/* Backward functions for region 2*/
/* iteration process */
export const ZPH_5 = (P, h) => {
  const eps = 1.0E-6
  
  let T =(h - 1240.0)*0.37; // 1st guess using linear function

  let Flag = 0
  let state
  for(let n=1;n<=10;n++){
    state = region_5(P, T)
    const dlt = h - state.h
    if (Math.abs(dlt) <= eps){
      Flag=1
      break
    } 
    T += dlt / state.cp
  }
  if(Flag==0){
    throw new RangeError("function ZPH_5 not converged in Aux_5.mjs")
  }  
  return state 
}

export const  ZPS_5 = (P, s) => {

  const eps = 1.0E-9
  const R = 0.461526
  const a = -0.463569131
  const b = 0.001662109
  const c = 6.705653717
  
  const pai = P

  let T = (s - a * Math.log(P) - c) / b; //1st guess using linear function

  let Flag = 0
  let Gibbs5  
  let tau
  for(let n=1;n<=10;n++){
     tau = 1000.0 / T
     Gibbs5 = Gibbs_5(pai,tau)
     const { G0, Gp, Gpp, Gt, Gtt, Gpt} = Gibbs5
     const s1= (tau * Gt - G0) * R
     const dlt = s - s1

    if (Math.abs(dlt) <= eps){
      Flag = 1
      break
    } 
    const dsdt = -R * tau * tau * Gtt / T
    T +=  dlt / dsdt
  }
  if(Flag==0){
    throw new RangeError("function ZPS_5 not converged in Aux_5.mjs")
  }

  const { G0, Gp, Gpp, Gt, Gtt, Gpt} = Gibbs5

  const g  = G0 * R * T;
  const u  = (tau * Gt - pai * Gp) * R * T
  const v  = pai * Gp * R * T / (P * 1e+3)
  const h  = tau * Gt * R * T
  const cp = -tau * tau * Gtt * R
  const tmp = Gp - tau * Gpt
  const tmp2 = tmp * tmp
  const w2 = Gp * Gp / (tmp2 /(tau * tau * Gtt) - Gpp) * R * T * 1e+3
  const w  = w2 <0 ? 0 : Math.sqrt(w2)

  const state = {
    g: g,
    u: u,
    v: v,
    P: P,
    T: T,
    h: h,
    s: s,
    cp: cp,
    w: w,
    MM: 5,
  }

  return state

}
    
