Shader "CrossFade"
{
  Properties
  {
    _Blend ( "Blend", Range ( 0, 1 ) ) = 0.5
    _MainTex ( "Texture 1", 2D ) = "white" {}
    _Texture2 ( "Texture 2", 2D ) = "" {}
    _Ambient ( "Ambient color", Color ) = (1.0, 1.0, 1.0, 1.0)
  }
  SubShader
  {
    Tags { "RenderType"="Opaque" }
    LOD 300
    Pass
    {
      SetTexture[_MainTex]
      SetTexture[_Texture2]
      {
        ConstantColor ( 0, 0, 0, [_Blend] )
        Combine texture Lerp( constant ) previous
      }    
    }
  
    CGPROGRAM
    #pragma surface surf Lambert finalcolor:mycolor
    
    sampler2D _MainTex;
    sampler2D _Texture2;
    float _Blend;
    
    struct Input
    {
      float2 uv_MainTex;
      float2 uv_Texture2;
    };
    
    fixed4 _Ambient;
    
    void mycolor(Input IN, SurfaceOutput o, inout fixed4 color)
    {
      fixed4 t2  = tex2D ( _Texture2, IN.uv_Texture2 );
      color = lerp(color, t2*_Ambient, _Blend);
    }
    
    void surf ( Input IN, inout SurfaceOutput o )
    {
      fixed4 t1  = tex2D( _MainTex, IN.uv_MainTex );
      o.Albedo = t1;
    }
    ENDCG
  }
  FallBack "Diffuse"
}
