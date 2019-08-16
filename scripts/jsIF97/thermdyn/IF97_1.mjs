//region 1 based on Eq.(7) of IAPWS-IF97
"use strict"

  const R = 0.461526 //gas constant in kJ/(kg K)

  const II = [] // lengthen is 35
  const JJ = [] // lengthen is 35
  const an = [] // lengthen is 35

  II[ 1]= 0; JJ[ 1]= -2;  an[ 1]= 0.14632971213167e+0 ; 
  II[ 2]= 0; JJ[ 2]= -1;  an[ 2]=-0.84548187169114e+0 ; 
  II[ 3]= 0; JJ[ 3]=  0;  an[ 3]=-0.37563603672040e+1 ; 
  II[ 4]= 0; JJ[ 4]=  1;  an[ 4]= 0.33855169168385e+1 ; 
  II[ 5]= 0; JJ[ 5]=  2;  an[ 5]=-0.95791963387872e+0 ; 
  II[ 6]= 0; JJ[ 6]=  3;  an[ 6]= 0.15772038513228e+0 ; 
  II[ 7]= 0; JJ[ 7]=  4;  an[ 7]=-0.16616417199501e-1 ; 
  II[ 8]= 0; JJ[ 8]=  5;  an[ 8]= 0.81214629983568e-3 ; 
  II[ 9]= 1; JJ[ 9]= -9;  an[ 9]= 0.28319080123804e-3 ; 
  II[10]= 1; JJ[10]= -7;  an[10]=-0.60706301565874e-3 ; 
  II[11]= 1; JJ[11]= -1;  an[11]=-0.18990068218419e-1 ; 
  II[12]= 1; JJ[12]=  0;  an[12]=-0.32529748770505e-1 ; 
  II[13]= 1; JJ[13]=  1;  an[13]=-0.21841717175414e-1 ; 
  II[14]= 1; JJ[14]=  3;  an[14]=-0.52838357969930e-4 ; 
  II[15]= 2; JJ[15]= -3;  an[15]=-0.47184321073267e-3 ; 
  II[16]= 2; JJ[16]=  0;  an[16]=-0.30001780793026e-3 ; 
  II[17]= 2; JJ[17]=  1;  an[17]= 0.47661393906987e-4 ; 
  II[18]= 2; JJ[18]=  3;  an[18]=-0.44141845330846e-5 ; 
  II[19]= 2; JJ[19]= 17;  an[19]=-0.72694996297594e-15; 
  II[20]= 3; JJ[20]= -4;  an[20]=-0.31679644845054e-4 ; 
  II[21]= 3; JJ[21]=  0;  an[21]=-0.28270797985312e-5 ; 
  II[22]= 3; JJ[22]=  6;  an[22]=-0.85205128120103e-9 ; 
  II[23]= 4; JJ[23]= -5;  an[23]=-0.22425281908000e-5 ; 
  II[24]= 4; JJ[24]= -2;  an[24]=-0.65171222895601e-6 ; 
  II[25]= 4; JJ[25]= 10;  an[25]=-0.14341729937924e-12; 
  II[26]= 5; JJ[26]= -8;  an[26]=-0.40516996860117e-6 ; 
  II[27]= 8; JJ[27]=-11;  an[27]=-0.12734301741641e-8 ; 
  II[28]= 8; JJ[28]= -6;  an[28]=-0.17424871230634e-9 ; 
  II[29]=21; JJ[29]=-29;  an[29]=-0.68762131295531e-18; 
  II[30]=23; JJ[30]=-31;  an[30]= 0.14478307828521e-19; 
  II[31]=29; JJ[31]=-38;  an[31]= 0.26335781662795e-22; 
  II[32]=30; JJ[32]=-39;  an[32]=-0.11947622640071e-22; 
  II[33]=31; JJ[33]=-40;  an[33]= 0.18228094581404e-23; 
  II[34]=32; JJ[34]=-41;  an[34]=-0.93537087292458e-25; 


export const region_1 = (P, T) => {
  if(P<=0.0 || T<=0.0){
    throw new RangeError("function region_1 P<=0 T<=0 in IF97_1.mjs")
  }
  const pai = P/16.53;
  const tau = 1386.0/T;
  const {G0, Gp, Gpp, Gt, Gtt, Gpt} = Gibbs_1(pai, tau)
  
  const g = G0 * R * T
  const u = (tau * Gt - pai * Gp) * R * T
  const v = pai * Gp * R * T / (P*1.0e3)
  const h = tau * Gt * R * T
  const s = (tau * Gt - G0) * R
  const cp = -tau * tau * Gtt * R
  const tmp = (Gp - tau * Gpt)
  const tmp2 = tmp * tmp
  const kappa = Gp / (pai * (tmp2 /(tau * tau * Gtt) - Gpp)) 
  const w2 = Gp * Gp / (tmp2 / (tau * tau * Gtt) - Gpp)* R * T * 1.0e3
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
    k: kappa,
    w: w,
    MM: 1,
  }
  return state
}

export const Gibbs_1 = (pai, tau) => {
  const pn = 7.1 -pai
  const tn = tau -1.222

  let G0 = 0.0
  let Gp = 0.0
  let Gpp = 0.0
  let Gt = 0.0
  let Gtt = 0.0
  let Gpt = 0.0

  const pnPow = []
  const tnPow = []
  const pn2 = pn * pn
  const tn2 = tn * tn

  for(let i=1;i<=34;i++){
    pnPow[i] = Math.pow(pn, II[i])
    tnPow[i] = Math.pow(tn, JJ[i])
  }

  for(let i=1;i<=34;i++){
    G0  += an[i] * pnPow[i] * tnPow[i]
    Gt  += an[i] * pnPow[i] * JJ[i] * tnPow[i]/tn
    Gtt += an[i] * pnPow[i] * JJ[i] * (JJ[i]-1) * tnPow[i]/tn2 
  }

  for(let i=9; i<=34;i++){
    Gp  -=  an[i] * II[i] * pnPow[i]/pn * tnPow[i]
    Gpt -=  an[i] * II[i] * pnPow[i]/pn * JJ[i] * tnPow[i]/tn
  }
  for(let i=15;i<=34;i++){
    Gpp += an[i] * II[i] * (II[i]-1) * pnPow[i]/pn2 * tnPow[i]
  }
  
  const Gibbs = {
    G0 : G0,
    Gp : Gp,
    Gpp : Gpp,
    Gt : Gt,
    Gtt : Gtt,
    Gpt : Gpt,
  }

  return Gibbs 
}
