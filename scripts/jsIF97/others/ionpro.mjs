//c-------------------------------------------
//      subroutine ionpro(T,rho,log10Kw)
//c-------------------------------------------
//
//c     input
//c         T:   temperature in K
//c         rho: density in kg/m^3
//c     output
//c      log10Kw: logarithm, in unit of base 10, of ion product Kw/(mol kg^-1)^2
//
//c     This subroutine is based on;
//c     "Release on the Ion Product of Water Substance",
//c     May 1980

 const A = -4.098  
 const B = -3245.2 
 const C =  2.2362e5 
 const D = -3.984e7  
 const E =  13.957 
 const F = -1262.3 
 const G =  8.5641e5 


export const ionpro = (T, rho) => {
  const log10Kw = A + B / T + C /(T * T) +D /(T * T * T)
             + (E + F / T + G /(T * T)) * Math.log10(rho * 1e-3)

  return log10Kw
}
