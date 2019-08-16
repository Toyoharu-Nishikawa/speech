/*******************************************************************/
/*expisen1(p,t,kappa,Cp,Cv)
/*  (given p and t calculate isentropic exponent, Cp, and Cv
/*   in the region 1)
/*expisen2(p,t,kappa,Cp,Cv)
/*  (given p and t calculate isentropic exponent, Cp, and Cv
/*   in the region 2)/
/*expisen3(p,t,kappa,Cp,Cv)
/*  (given p and t calculate isentropic exponent, Cp, and Cv
/*   in the region 3)
/*expsatL3(t,kappa,Cp,Cv)
/*  (given t calculates isentropic exponent, Cp, and Cv of
/*   saturated liquid in the region 3)
/*expsatG3(t,kappa,Cp,Cv)
/*  (given t calculates isentropic exponent, Cp, and Cv of
/*   saturated vapor in the region 3)
/*expisen3h(v,t,kappa,Cp,Cv)
/*  (given v and t calculate isentropic exponent, Cp, and Cv
/*   in the region 3)
/*expisen5(p,t,kappa,Cp,Cv)
/*  (given p and t calculate isentropic exponent, Cp, and Cv
/*   in the region 5)
/*******************************************************************/

import {region_1, Gibbs_1} from "./IF97_1.mjs"
import {region_2, Gibbs_2} from "./IF97_2.mjs"
import {region_3, Helm_3} from "./IF97_3.mjs"
import {region_5, Gibbs_5} from "./IF97_5.mjs"
import {Vsatl_3, Vsatg_3, VPT_3} from "./Aux_3.mjs"


"use strict"

/*isentropic exponent, Cp, and Cv in region 1, 2, 3, and 5 */
export const  expisen1 = (P, T) => {
  if(P<=0.0 || T<=0.0){
    throw new RangeError("function expisen1 P<=0 T<=0 in expisen.mjs")
  }
 
  const Tn=1386.0
  const Pn=16.53  
  const R=0.461526
  
  const pai = P/Pn
  const tau =Tn/T

  const {G0, Gp, Gpp, Gt, Gtt, Gpt} = Gibbs_1(pai, tau)

  const v    = R * T * Gp * 1.0e-3 / Pn
  const dvdp = R * T * Gpp *1.0e-3 / (Pn*Pn)
  const dpdv = 1.0/dvdp
  const cp   = -tau * tau * Gtt * R
  const tmp = Gp-tau*Gpt
  const tmp2 = tmp * tmp
  const cv   = (-tau * tau * Gtt + tmp2 / Gpp) * R
  const dpdvs = cp/cv * dpdv
  const kappa = -dpdvs * v / P
  
  const expis = {
    cp :cp,
    cv: cv,
    k: kappa
  }
  
  return expis 
}



export const expisen2 = (P, T) => {
  if(P<=0.0 || T<=0.0){
    throw new RangeError("function expisen2 P<=0 T<=0 in expisen.mjs")
  }

  const Tn=540.0
  const R=0.461526

  const pai = P
  const tau=Tn/T

  const {G0,Gp,Gpp,Gt,Gtt,Gpt}= Gibbs_2(pai, tau)

  const v    = R * T * Gp * 1.0e-3
  const dvdp = R * T * Gpp * 1.0e-3
  const dpdv = 1.0/dvdp
  const cp   = -tau * tau * Gtt * R
  const tmp = Gp-tau*Gpt
  const tmp2 = tmp * tmp
  const cv   = (-tau * tau * Gtt+ tmp2 / Gpp) * R
  const dpdvs = cp / cv * dpdv;
  const kappa = -dpdvs * v / P
 
  const expis = { 
    cp: cp,
    cv: cv,
    k: kappa,
  }
  
  return expis 
}

/* isentropic exponent, Cp, and Cv in region 3, p and T as main variables*/
export const expisen3 = (P, T) => {
  const v = VPT_3(P, T);
  const expis = expisen3h(v, T)
 
  return expis 
}

/* isentropic exponent, Cp, and Cv of saturated liquid in region 3*/
export const expsatL3 = (T) => {
  const v = Vsatl_3(T)
  const expis = expisen3h(v, T)

  return expis 
}

/* isentropic exponent, Cp, and Cv of saturated liquid in region 3*/
export const expsatG3 = (T) => {
  const v = Vsatg_3(T)
  const expis = expisen3h(v, T)

  return expis 
}

/* isentropic exponent, Cp, and Cv in region 3, v and T as main variables*/
export const expisen3h = (v, T) => {
  if(v<=0.0 || T<=0.0){
    throw new RangeError("function expisen3h v<=0 T<=0 in expisen.mjs")
  }
  const Tn  = 647.096
  const rhon= 322.0
  const R   = 0.461526
  
  const rho = 1.0 / v
  const dlt = rho / rhon
  const tau = Tn / T

  const {F0, Fd , Fdd, Ft, Ftt, Fdt} = Helm_3(dlt, tau)

  const P    = dlt * Fd * R * T * rho * 1.0e-3
  const dpdd = R * T * rhon * (2.0 * dlt * Fd + dlt * dlt * Fdd) * 1.0e-3
  const dpdv = -dpdd / (rhon * v * v);
  const tmp = dlt * Fd - dlt * tau * Fdt
  const tmp2 = tmp * tmp
  const cp   = (-tau * tau * Ftt + tmp2/(2.0 * dlt * Fd + dlt * dlt * Fdd)) * R
  const cv   = (-tau * tau * Ftt) * R
  const dpdvs= cp / cv * dpdv;
  const kappa= -dpdvs *v / P;

  const expis = { 
    cp: cp,
    cv: cv,
    k: kappa,
  }
  
  return expis 
}

export const expisen5 = (P, T) => {

  if(P<=0.0||T<=0.0){
    throw new RangeError("function expisen5 P<=0 T<=0 in expisen.mjs")
  }
 
  const Tn = 1000.0
  const R = 0.461526
  const pai = P
  const tau = Tn / T

  const { G0, Gp, Gpp, Gt, Gtt, Gpt} = Gibbs_5(pai, tau)
  
  const v = R * T * Gp * 1.0e-3
  const dvdp = R * T * Gpp * 1.0e-3
  const dpdv = 1.0 / dvdp
  const cp = -tau * tau * Gtt * R
  const tmp = Gp-tau * Gpt
  const tmp2 = tmp * tmp
  const cv = (-tau * tau * Gtt + tmp2 / Gpp) * R
  const dpdvs= cp /cv * dpdv
  const kappa = -dpdvs * v / P

  const expis = { 
    cp: cp,
    cv: cv,
    k: kappa,
  }
  
  return expis 
}
    
