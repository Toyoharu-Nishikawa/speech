/*******************************************************************/
/*  propPS.for
/*  (given P and S calculate properties of the regions 1, 2, 3, 5,
/*   and wet steam region)
/*******************************************************************/

import {region_1} from "./IF97_1.mjs"
import {region_2} from "./IF97_2.mjs"
import {region_3} from "./IF97_3.mjs"
import {TsatP} from './IF97_Sat.mjs'
import {ZPS_1} from "./Aux_1.mjs"
import {ZPS_2} from "./Aux_2.mjs"
import {Vsatl_3, Vsatg_3,ZPS_30, ZPS_31 ,ZPS_32} from "./Aux_3.mjs"
import {ZPS_5} from "./Aux_5.mjs"
import {RegPS} from "./Reg_ps.mjs"

"use strict"

export const propPS = (P, s) => {
 
  const M = RegPS(P, s)
  switch(M){
    case 1 :{
      const state = ZPS_1(P, s)
      state.x = 0.0
      return state 
    }
    case 2 : {
      const state = ZPS_2(P, s)
      if(state.T >= 647.096 && state.P >= 22.064){
        state.x = -1
        return state
      }
      else{
        state.x = 1    
        return state
      }
    }
    case 30 : {
      const state = ZPS_30(P, s)
      state.x=-1 //super critical region    
      return state
    }
    case 31 : {
      const state = ZPS_31(P, s)
      state.x=0.0;    
      return state
    }
    case 32 : {
      const state = ZPS_32(P, s)
      state.x=1.0 
      return state
    }
    case 5 : {
      const state = ZPS_5(P, s)
      state.x=1.0
      return state
    }
    case 12 : {
      const T = TsatP(P)
      const state1 = region_1(P, T)
      const state2 = region_2(P, T)

      const x = (s - state1.s) / (state2.s - state1.s)
      const g = state2.g * x + state1.g * (1.0 - x)
      const u = state2.u * x + state1.u * (1.0 - x)
      const v = state2.v * x + state1.v * (1.0 - x)
      const h = state2.h * x + state1.h * (1.0 - x)    
      const cp = -1

      const del = 1e-6
      const Ptmp = P + del
      const Ttmp = TsatP(Ptmp)
      const state1Tmp = region_1(Ptmp, Ttmp)
      const state2Tmp = region_2(Ptmp, Ttmp)
      const xTmp = (s - state1Tmp.s) / (state2Tmp.s - state1Tmp.s)
      const vTmp = state2Tmp.v * xTmp + state1Tmp.v * (1.0 - xTmp)
      const kappa = - Math.log(Ptmp / P) / Math.log(vTmp / v)
      const w = Math.sqrt(kappa * v * P * 1.0e+6)

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
        k: kappa,
        x: x,
        MM: 4,
      }

      return state
 
    }
    case 33 : {

      const T = TsatP(P)
      const v1 = Vsatl_3(T)
      const v2 = Vsatg_3(T)
      const state1 = region_3(v1, T)
      const state2 = region_3(v2, T)
 
      const x = (s - state1.s) / (state2.s - state1.s)
      const g = state2.g * x + state1.g * (1.0 - x)
      const u = state2.u * x + state1.u * (1.0 - x)
      const v = state2.v * x + state1.v * (1.0 - x)
      const h = state2.h * x + state1.h * (1.0 - x)    
      const cp = -1

      const del = 1e-6
      const Ptmp = P + del
      const Ttmp = TsatP(Ptmp)
      const v1Tmp = Vsatl_3(Ttmp)
      const v2Tmp = Vsatg_3(Ttmp)
      const state1Tmp = region_3(v1Tmp, Ttmp)
      const state2Tmp = region_3(v2Tmp, Ttmp)
      const xTmp = (s - state1Tmp.s) / (state2Tmp.s - state1Tmp.s)
      const vTmp = state2Tmp.v * xTmp + state1Tmp.v * (1.0 - xTmp)
      const kappa = -Math.log(Ptmp / P) / Math.log(vTmp / v)
      const w = Math.sqrt(kappa * v * P * 1.0e+6)

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
        k: kappa,
        x: x,
        MM: 4,
      }

      return state
    }
    default : {
      throw new RangeError("function propPS M in propPS.mjs")
    }
  }
}
