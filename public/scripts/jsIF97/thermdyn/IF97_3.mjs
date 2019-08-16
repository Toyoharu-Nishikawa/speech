/*******************************************************************/
/*  region_3(V,T,g,u,P,h,s,Cp,w)                                   */
/*  Helm_3(dlt,tau,F0,Fd,Fdd,Ft,Ftt,Fdt)                           */
/*  PVT_3(V,T,P)                                                   */
/*  dPdV_3(V,T,dPdV)                                               */
/*******************************************************************/

// region 3 based on Eq.(15) of IAPWS-IF97
"use strict"

  const R   = 0.461526 //gas constant in in kJ/kgK

  const II = []
  const JJ = []
  const an = []
 
  II[ 1]=   0  ;  JJ[ 1]=   0  ;  an[ 1]=   0.10658070028513E+1  ;
  II[ 2]=   0  ;  JJ[ 2]=   0  ;  an[ 2]=  -0.15732845290239E+2  ;
  II[ 3]=   0  ;  JJ[ 3]=   1  ;  an[ 3]=   0.20944396974307E+2  ;
  II[ 4]=   0  ;  JJ[ 4]=   2  ;  an[ 4]=  -0.76867707878716E+1  ;
  II[ 5]=   0  ;  JJ[ 5]=   7  ;  an[ 5]=   0.26185947787954E+1  ;
  II[ 6]=   0  ;  JJ[ 6]=  10  ;  an[ 6]=  -0.28080781148620E+1  ;
  II[ 7]=   0  ;  JJ[ 7]=  12  ;  an[ 7]=   0.12053369696517E+1  ;
  II[ 8]=   0  ;  JJ[ 8]=  23  ;  an[ 8]=  -0.84566812812502E-2  ;
  II[ 9]=   1  ;  JJ[ 9]=   2  ;  an[ 9]=  -0.12654315477714E+1  ;
  II[10]=   1  ;  JJ[10]=   6  ;  an[10]=  -0.11524407806681E+1  ;
  II[11]=   1  ;  JJ[11]=  15  ;  an[11]=   0.88521043984318E+0  ;
  II[12]=   1  ;  JJ[12]=  17  ;  an[12]=  -0.64207765181607E+0  ;
  II[13]=   2  ;  JJ[13]=   0  ;  an[13]=   0.38493460186671E+0  ;
  II[14]=   2  ;  JJ[14]=   2  ;  an[14]=  -0.85214708824206E+0  ;
  II[15]=   2  ;  JJ[15]=   6  ;  an[15]=   0.48972281541877E+1  ;
  II[16]=   2  ;  JJ[16]=   7  ;  an[16]=  -0.30502617256965E+1  ;
  II[17]=   2  ;  JJ[17]=  22  ;  an[17]=   0.39420536879154E-1  ;
  II[18]=   2  ;  JJ[18]=  26  ;  an[18]=   0.12558408424308E+0  ;
  II[19]=   3  ;  JJ[19]=   0  ;  an[19]=  -0.27999329698710E+0  ;
  II[20]=   3  ;  JJ[20]=   2  ;  an[20]=   0.13899799569460E+1  ;
  II[21]=   3  ;  JJ[21]=   4  ;  an[21]=  -0.20189915023570E+1  ;
  II[22]=   3  ;  JJ[22]=  16  ;  an[22]=  -0.82147637173963E-2  ;
  II[23]=   3  ;  JJ[23]=  26  ;  an[23]=  -0.47596035734923E+0  ;
  II[24]=   4  ;  JJ[24]=   0  ;  an[24]=   0.43984074473500E-1  ;
  II[25]=   4  ;  JJ[25]=   2  ;  an[25]=  -0.44476435428739E+0  ;
  II[26]=   4  ;  JJ[26]=   4  ;  an[26]=   0.90572070719733E+0  ;
  II[27]=   4  ;  JJ[27]=  26  ;  an[27]=   0.70522450087967E+0  ;
  II[28]=   5  ;  JJ[28]=   1  ;  an[28]=   0.10770512626332E+0  ;
  II[29]=   5  ;  JJ[29]=   3  ;  an[29]=  -0.32913623258954E+0  ;
  II[30]=   5  ;  JJ[30]=  26  ;  an[30]=  -0.50871062041158E+0  ;
  II[31]=   6  ;  JJ[31]=   0  ;  an[31]=  -0.22175400873096E-1  ;
  II[32]=   6  ;  JJ[32]=   2  ;  an[32]=   0.94260751665092E-1  ;
  II[33]=   6  ;  JJ[33]=  26  ;  an[33]=   0.16436278447961E+0  ;
  II[34]=   7  ;  JJ[34]=   2  ;  an[34]=  -0.13503372241348E-1  ;
  II[35]=   8  ;  JJ[35]=  26  ;  an[35]=  -0.14834345352472E-1  ;
  II[36]=   9  ;  JJ[36]=   2  ;  an[36]=   0.57922953628084E-3  ;
  II[37]=   9  ;  JJ[37]=  26  ;  an[37]=   0.32308904703711E-2  ;
  II[38]=  10  ;  JJ[38]=   0  ;  an[38]=   0.80964802996215E-4  ;
  II[39]=  10  ;  JJ[39]=   1  ;  an[39]=  -0.16557679795037E-3  ;
  II[40]=  11  ;  JJ[40]=  26  ;  an[40]=  -0.44923899061815E-4  ;
 
export const region_3 = (v, T) => {
  if(v<=0.0 || T<=0.0){
    throw new RangeError("function region_3 v<=0 T<=0 in IF97_3.mjs")
  }

  const  D=1.0/v;  
  const  dlt = D / 322.0;
  const  tau = 647.096 / T;

  const {F0, Fd , Fdd, Ft, Ftt, Fdt} = Helm_3(dlt, tau)

  const u  = tau * Ft * R * T
  const g  = (dlt*Fd + F0) * R * T
  const P  = dlt * Fd * R * T * D * 1e-3
  const h  = (tau * Ft + dlt * Fd) * R * T
  const s  = (tau * Ft - F0) * R
  const tmp = dlt * Fd - dlt * tau * Fdt
  const tmp2 = tmp*tmp
  const cp = (
            -tau * tau * Ftt
            +tmp2/(2.0*dlt*Fd+dlt*dlt*Fdd)
          )* R
  const kappa = 2 + dlt - tmp2 / (tau * tau * Ftt * dlt * Fd)
  const w2 = (
        2.0*dlt*Fd + dlt*dlt*Fdd
        - tmp2/(tau*tau*Ftt)
       ) * R * T * 1E+3;
  const w  = w2 < 0 ? 0 : Math.sqrt(w2)

  const state = {
    u: u,
    g: g,
    v: v,
    P: P,
    T: T,
    h: h,
    s: s,
    cp: cp,
    w: w,
    k: kappa,
    MM: 3,
  }

  return state
}


export const Helm_3 = (dlt, tau) => {
   if(dlt<=0.0){         
    throw new RangeError("function Helm_3 dlt<=0 in IF97_3.mjs")
  }
 
  let F0 = 0.0
  let Fd = 0.0
  let Fdd= 0.0
  let Ft = 0.0
  let Ftt= 0.0
  let Fdt= 0.0

  const dlt2 = dlt*dlt
  const tau2 = tau*tau
  const dltPow = []
  const tauPow = []

  for(let i=2;i<=40;i++){
    dltPow[i] = Math.pow(dlt,II[i])
    tauPow[i] = Math.pow(tau,JJ[i])
  }

  for(let i=2;i<=40;i++){
    F0 += an[i] * dltPow[i] * tauPow[i] 
  }       
  for(let i=9;i<=40;i++){      
    Fd  +=  an[i] * II[i] * dltPow[i]/dlt * tauPow[i] 
    Fdt +=  an[i] * II[i] * dltPow[i]/dlt * JJ[i] * tauPow[i] /tau
  }                      
  for(let i=13;i<=40;i++){      
    Fdd += an[i] * II[i] * (II[i]-1) * dltPow[i]/dlt2 * tauPow[i] 
  }                                     
  for(let i=3;i<=40;i++){      
    Ft +=  an[i] * dltPow[i] * JJ[i] * tauPow[i]/tau
  }           
  for(let i=4;i<=40;i++){      
    Ftt += an[i] * dltPow[i] * JJ[i] * (JJ[i]-1) *tauPow[i]/tau2 
  }
  
  F0  += an[1]*Math.log(dlt)
  Fd  += an[1]/dlt
  Fdd -= an[1]/dlt2
  
  const Helm = {
    F0 : F0,
    Fd : Fd,
    Fdd: Fdd,
    Ft : Ft,
    Ftt: Ftt,
    Fdt:Fdt,
  }

  return Helm 
}


export const PVT_3 = (v, T) => {
  if(v<=0.0 || T<=0.0){
    throw new RangeError("function PVT_3 v<=0 T<=0 in IF97_3.mjs")
  }

  const D = 1.0/v
  const dltx = D / 322.0
  const taux = 647.096 / T

  let P = an[1]/dltx;

  for(let i=9;i<=40;i++){
    P +=  an[i] * II[i] * Math.pow(dltx,II[i]-1) * Math.pow(taux,JJ[i])
  }

  P = dltx * P * R * T * D * 1E-3
      
  return P 
}

export const dPdV_3 = (v, T) => {
  if(v<=0.0 || T<0.0){
    throw new RangeError("function dPdV_3 v<=0 T<=0 in IF97_3.mjs")
  }

  const D = 1.0/v
  const dltx = D / 322.0
  const taux = 647.096 / T

  let dPdV = an[1]

  for(let i=9;i<=40;i++){
    dPdV += an[i]*II[i]*(II[i]+1.0)*Math.pow(dltx,II[i])*Math.pow(taux,JJ[i])
  }

  dPdV -=T * R * D * D * dPdV * 1E-3

  return dPdV 
}  
