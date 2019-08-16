/*******************************************************************/
/*  ZPH_2(P,H,t,v,g,u,s,Cp,w)                                      */
/*  (given P and H, calculate t and other properties in the region2*/
/*  (Newton method)
/*  ZPS_2(P,S,t,v,g,u,h,Cp,w)                                      */
/*  (given P and S, calculate t and other properties in the region2*/
/*  (Newton method)
/*******************************************************************/

/* Backward functions for region 2*/
/* iteration process */
"use strict"
import {Tph2,Tps2} from "./IF97_BK2.mjs" 
import {region_2,Gibbs_2} from "./IF97_2.mjs" 

export const ZPH_2 = (P, h) => {
  const eps = 1.0e-6
  let T = Tph2(P, h)

  let Flag = 0
  let state
  for(let n=1;n<=10;n++){
    state = region_2(P, T)
    const dlt = h - state.h
    if (Math.abs(dlt) <= eps){
      Flag = 1
      break
    } 
    T += dlt / state.cp
  }
  if(Flag==0){
    throw new RangeError("function ZPH_2 not converged in Aux_2.mjs");
    return -1;
  }  
  return state 
}

export const ZPS_2 = (P, s) => {
  const eps = 1.0e-9
  const R = 0.461526
  let T = Tps2(P, s)

  if(P<=0.0 || T<=0.0){
    throw new RangeError("function ZPS_2 P<=0 T<=0 in Aux_2.mjs")
  }
  
  const pai = P
  let Flag = 0
  let Gibbs2
  let tau
  for(let n=1;n<=10;n++){
    tau = 540.0 / T
    Gibbs2  = Gibbs_2(pai, tau)
    const {G0,Gp,Gpp,Gt,Gtt,Gpt}= Gibbs2
    const s1= (tau * Gt - G0) * R;
    const dlt = s - s1
    if (Math.abs(dlt) <= eps){
      Flag=1
      break
    } 
    const dsdt = -R * tau * tau * Gtt /T
    T += dlt / dsdt
   }      
  if(Flag==0){
    throw new RangeError("function ZPS_2 ZPS_2 not converged in Aux_2.mjs");
  }

  const {G0,Gp,Gpp,Gt,Gtt,Gpt}= Gibbs2

  const g  = G0 * R * T
  const u  = (tau * Gt - pai * Gp) * R * T
  const v  = pai * Gp * R * T / (P * 1e+3)
  const h  = tau * Gt * R * T
  const cp = -tau * tau * Gtt * R
  const tmp = Gp - tau * Gpt
  const tmp2 = tmp * tmp
  const w2 = Gp * Gp /(tmp2 / (tau * tau * Gtt) - Gpp) * R * T * 1e+3;

  const w = w2 < 0 ? 0 : Math.sqrt(w2)

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
    MM:2,
  }
  return state
 
}
    
