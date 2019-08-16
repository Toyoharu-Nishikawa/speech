/*********************************************************************/ 
/*spinl_3(T, Vspinl)
/*  (given T calculates V at liquid spinodal in the region 3)
/*  (bisection method)
/*sping_3(T, Vsping)
/*  (given T calculates V at vapor spinodal in the region 3)
/*  (bisection method)
/*VPT_3(P,T,V)
/*  (given P and T calculate V in the region 3)
/*  (This subroutine calls subroutines VPT_30, VPT_31, and VPT_32)
/*VPT_30(P,T,V)
/*  (given P and T calculate V in the region 3 above critical
/*   temperature)
/*  (bisection method)
/*VPT_31(P,T,V)
/*  (given P and T calculate V in the region 3 liquid phase
/*   including metastable state)
/*  (bisection method)
/*VPT_32(P,T,V)
/*  (given P and T calculate V in the region 3 vapor phase
/*   including metastable state)
/*  (bisection method)
/*Vsatl_3(T, Vl)
/*  (given T calculate V of saturated liquid in the region 3)
/*  (bisection method)
/*Vsatg_3(T, Vg)
/*  (given T calculate V of saturated vapor in the region 3)
/*  (bisection method)
/*ZPH_30(P,H,t,v,g,u,s,Cp,w)
/*  (given P and H calculate properties in the region 3
/*   above critical pressure)
/*ZPH_31(P,H,t,v,g,u,s,Cp,w)
/*  (given P and H calculate liquid properties in the region 3
/*   below critical pressure)
/*ZPH_32(P,H,t,v,g,u,s,Cp,w)
/*  (given P and H calculate vapor properties in the region 3
/*   below critical pressure)
/*ZPS_30(P,S,t,v,g,u,h,Cp,w)
/*  (given P and S calculate properties in the region 3
/*   above critical pressure)
/*ZPS_31(P,S,t,v,g,u,h,Cp,w)
/*  (given P and S calculate liquid properties in the region 3
/*   below critical pressure)
/*ZPS_32(P,S,t,v,g,u,h,Cp,w)
/*  (given P and S calculate vapor properties in the region 3
/*   below critical pressure)
/*           
/*********************************************************************/ 

import {region_3, PVT_3,dPdV_3} from './IF97_3.mjs'
import {PsatT,TsatP} from './IF97_Sat.mjs'
import {Pb23T,Tb23P} from './IF97_B23.mjs'

"use strict"

export const spinl_3 = (T) => {
  const Vmin = 1.3e-3
  const Vcrt = 1.0/322.0 
  
  let d1 = Vcrt
  let d2 = Vmin
  let dm 

  for(let n=1;n<=30;n++){
    dm = (d1 + d2) * 0.5
    const dPdV = dPdV_3(dm, T)
    if (dPdV >= 0.0){
      d1 = dm
    }
    else{
      d2 = dm
    }
  }
  const Vspinl = dm
  return Vspinl 
}

export const sping_3 = (T) => {
 
  const Vmax = 8.9e-3
  const Vcrt = 1.0/322.0
  
  let d1 = Vmax
  let d2 = Vcrt
  let dm 
  
  for(let n=1;n<=30;n++){
    dm = (d1 + d2) * 0.5
    const dPdV = dPdV_3(dm, T)
    if (dPdV <= 0.0){
      d1 = dm
    }
    else{
      d2 = dm
    }
  }
  const Vsping = dm;
  
  return Vsping
}

export const VPT_3 = (P, T) => {
  const Tcrt  = 647.096
  
  if (T >= Tcrt){
    const v = VPT_30(P, T)
    return v
  }
  else{
    const P1 = PsatT(T)
    if(P <= P1){
      const v = VPT_32(P, T)
      return v
    }
    else{
      const v = VPT_31(P, T)
      return v
    }
  }
}

export const VPT_30 = (P, T) => {
  const Vmin = 1.3e-3
  const Vmax = 8.9e-3 
  
  let d1 = Vmax;
  let d2 = Vmin;
  let dm 
  
  for(let n=1;n<=40;n++){
    dm = (d1 + d2) * 0.5
    const P1 = PVT_3(dm, T)
    if (P1 <= P){
      d1 = dm
    }
    else{
      d2 = dm
    }
  }
  const v = dm
  return v
}

export const VPT_31 = (P, T) => {
  const Vmin = 1.3e-3
  const Vspinl = spinl_3(T)
  
  let d1 = Vspinl
  let d2 = Vmin
  let dm
  
  for(let n=1;n<=40;n++){
    dm = (d1 + d2) * 0.5
    const P1 = PVT_3(dm, T)
    if (P1 <= P){
      d1 = dm
    }
    else{
      d2 = dm
    }
  }
  const v = dm
  return v 
}

export const VPT_32 = (P, T) => {
  const Vmax = 8.9e-3
  const Vsping =sping_3(T)  

  let d1 = Vmax;
  let d2 = Vsping;
  let dm 
  
  for(let n=1;n<=40;n++){
    dm = (d1 + d2) * 0.5
    const P1 = PVT_3(dm, T)
    if (P1 <= P){
      d1 = dm
    }
    else{
      d2 = dm
    }
  }
  const v = dm
  return v 
}

export const Vsatl_3 = (T) => {
  const Psat = PsatT(T)
  
  const Vspinl = spinl_3(T)
  const Vmin=1.3e-3
  
  let d1 = Vspinl
  let d2 = Vmin
  let dm

  for(let n=1;n<=40;n++){
    dm = (d1 + d2) * 0.5
    const P1 = PVT_3(dm, T)
    if(P1 <=Psat){
      d1 = dm
    }
    else{
      d2 = dm
    }
  }
  const Vl = dm;
  
  return Vl
}

export const Vsatg_3 = (T) => {

  const Psat = PsatT(T)
    
  const Vmax = 8.9e-3
  const Vsping = sping_3(T)
  
  let d1 = Vmax
  let d2 = Vsping
  let dm
 
  for(let n=1;n<=40;n++){
    dm = (d1 + d2) * 0.5
    const P1 = PVT_3(dm, T)
    if(P1 <=Psat){
      d1 = dm
    }
    else{
      d2 = dm
    }
  }
  const Vg = dm
  
  return Vg 
}

export const ZPH_30 = (P, h) => {
  let d1 =  Tb23P(P)
  let d2 = 623.15
  let dm
  let v
  
  for(let n=1;n<=40;n++){
    dm = (d1 + d2) * 0.5
    v = VPT_3(P, dm)
    const state = regions_3(v, dm)
    const h1 = state.h
    if(h1 >=h){
      d1 = dm
    }
    else{
      d2 = dm
    }
  }
  const state = regions_3(v, dm)
  
  return state 
}

export const ZPH_31 = (P, h) => {
  let d1 =  TsatP(P)
  let d2=623.15
  let dm
  let v
  
  for(let n=1;n<=40;n++){
    dm = (d1 + d2) * 0.5
    v = VPT_3(P, dm)
    const state = region_3(v, dm)
    const h1 = state.h
    if(h1 >=h){
      d1 = dm
    }
    else{
      d2 = dm
    }
  }
  const state = region_3(v, dm)
  
  return state 
}

export const ZPH_32 = (P, h) => {
  let d1 = Tb23P(P)
  let d2 = TsatP(P)
  let dm
  let v
  
  for(let n=1;n<=40;n++){
    dm = (d1 + d2) * 0.5
    v = VPT_3(P, dm)
    const state = region_3(v, dm)
    const h1 = state.h
    if(h1 >= h){
      d1 = dm
    }
    else{
      d2 = dm
    }
  }
  const state = region_3(v, dm)
  
  return state 
}

export const ZPS_30 = (P, s) => {
  let d1 = Tb23P(P)
  let d2 = 623.15
  let dm
  let v 
  
  for(let n=1;n<=40;n++){
    dm = (d1 + d2) * 0.5;
    v = VPT_3(P, dm)
    const state = region_3(v, dm)
    const s1 = state.s
    if(s1 >= s){
      d1 = dm
    }
    else{
      d2 = dm
    }
  }
  const state = region_3(v, dm)
  
  return state 
}

export const ZPS_31 = (P, s) => {
  let d1 = TsatP(P)
  let d2 = 623.15
  let dm
  let v
  
  for(let n=1;n<=40;n++){
    dm = (d1 + d2) * 0.5
    v = VPT_3(P, dm)
    const state = region_3(v, dm)
    const s1 = state.s
    if(s1 >= s){
      d1 = dm
    }
    else{
      d2 = dm
    }
  }
  const state = region_3(v, dm)
  
  return state
}

export const ZPS_32 = (P, s) => {
  let d1 = Tb23P(P)
  let d2 = TsatP(P)
  let dm
  let v
  
  for(let n=1;n<=40;n++){
    dm = (d1 + d2) * 0.5
    v = VPT_3(P, dm)
    const state = region_3(v, dm)
    const s1 = state.s
    if(s1 >= s){
      d1 = dm
    }
    else{
      d2 = dm
    }
  }
  const state = region_3(v, dm)
  
  return state 
}
    
