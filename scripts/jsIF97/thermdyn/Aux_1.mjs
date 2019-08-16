/*******************************************************************/
/*  ZPH_1(P,H,t,v,g,u,s,Cp,w)                                      */
/*  (given P and H, calculate t and other properties in the region1*/
/*  (Newton method)                                                */
/*  ZPS_1(P,S,t,v,g,u,h,Cp,w)                                      */
/*  (given P and S, calculate t and other properties in the region1*/ 
/*******************************************************************/

/* Backward functions for region 1*/
/* iteration process */

"use strict" 
import {Tph1,Tps1} from "./IF97_BK1.mjs" 
import {region_1,Gibbs_1} from "./IF97_1.mjs" 

const R=0.461526


export const ZPH_1 = (P, h) => {
  const eps=1.0e-6

  let T = Tph1(P, h)
  let Flag=0
  let state
  for(let n=1;n<=10;n++){
    state = region_1(P, T)
    const dlt = h - state.h;
    if (Math.abs(dlt) <= eps){
      Flag=1
      break
    } 
    T += dlt / state.cp;
  }
  if(Flag===0){
    throw new RangeError("ZPH_1 not converged")
  }  
  return state 
}

export const ZPS_1 = (P, s) => {
  const eps=1.0e-9

  let T = Tps1(P, s)
  
  const pai=P/16.53
  
  let Flag=0
  let Gibbs1
  let tau
  for(let n=1;n<=10;n++){
    tau = 1386.0 / T
    Gibbs1 = Gibbs_1(pai,tau)
    const {G0, Gp, Gpp, Gt, Gtt, Gpt} = Gibbs1
    const s1= (tau * Gt - G0) * R
    const dlt = s - s1
    if (Math.abs(dlt) <= eps){
      Flag=1
      break
    } 
    const dsdt = -R * tau * tau * Gtt / T
    T = T + dlt / dsdt
  }
  if(Flag==0){
    throw new RangeError("ZPS_1 not converged")
  }
  
  const {G0, Gp, Gpp, Gt, Gtt, Gpt} = Gibbs1
  const g  = G0 * R * T
  const u  = (tau * Gt - pai * Gp) * R * T
  const v  = pai * Gp * R * T / (P*1e+3)
  const h  = tau * Gt * R * T
  const cp = -tau * tau * Gtt * R
  const tmp = Gp - tau * Gpt
  const tmp2 = tmp * tmp
  const w2 = Gp * Gp / (tmp2 / (tau * tau * Gtt) - Gpp) * R * T * 1e+3
  const w  = w2 <0 ? 0 : Math.sqrt(w2)
 
  const state = {
    g: g,
    u: u,
    v: v,
    P: P,
    T: T,
    h: h,
    cp: cp,
    w: w,
    MM: 1,
  }
  
  return state
}
    
