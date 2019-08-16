/*******************************************************************/
/*  PsatT(T,P)                                                     */
/*  TsatP(P,T)                                                     */
/*******************************************************************/

// saturation pressure and temperature based on Eq.(30) and Eq.(31) of IAPWS-IF97
"use strict"
  const an = []
  
  an[ 1]= 0.11670521452767e+4
  an[ 2]=-0.72421316703206e+6
  an[ 3]=-0.17073846940092e+2
  an[ 4]= 0.12020824702470e+5
  an[ 5]=-0.32325550322333e+7
  an[ 6]= 0.14915108613530e+2
  an[ 7]=-0.48232657361591e+4
  an[ 8]= 0.40511340542057e+6
  an[ 9]=-0.23855557567849e+0
  an[10]= 0.65017534844798e+3


export const PsatT = (T) => {
 
  const teta = T + an[9]/(T - an[10])
      
  const A = teta*teta + an[1]*teta +an[2]
  const B = an[3]*teta*teta + an[4]*teta + an[5]
  const C = an[6]*teta*teta + an[7]*teta + an[8]
  const P = Math.pow(2.0*C/(-B+Math.sqrt(B*B-4.0*A*C)),4)
 
  return P 
}

export const TsatP = (P) => {
  if(P<=0.0){
    throw new RangeError("function TsatP P <=0 in IF97_Sat.mjs")
  }
  const beta = Math.sqrt(Math.sqrt(P));
      
  const E = beta*beta + an[3]*beta + an[6];
  const F = an[1]*beta*beta + an[4]*beta + an[7];
  const G = an[2]*beta*beta + an[5]*beta + an[8];
      
  const D = 2.0*G/(-F-Math.sqrt(F*F-4.0*E*G));
  const H =    (an[10]+D)
  const T = (an[10]+D-Math.sqrt( H*H - 4.0*(an[9]+an[10]*D)))/2.0;
  return T 
}
    
