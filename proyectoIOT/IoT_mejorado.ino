
#define trig1 11
#define echo1 10
#define trig2 13
#define echo2 12
#define trig3 15
#define echo3 14
#define trig4 7
#define echo4 6
#define trig5 5
#define echo5 4
#define trig6 3
#define echo6 2

//definir variables para medir
 float distancia1;
 float distancia2;
 float distancia3;
 float distancia4;
 float distancia5;
 float distancia6;
 int estado=0;
 int estado1=0;
 int estado2=0;
 int estado3=0;
 int estado4=0;
 int estado5=0;
 int estado6=0;
//definir variables de la funcion distancia 
float distancia_cm;
float duracion;
float distancia (int trig,int echo);
//int estado_vehiculo (float medicion);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(trig1,OUTPUT);
  pinMode(echo1,INPUT);
  pinMode(trig2,OUTPUT);
  pinMode(echo2,INPUT);
  pinMode(trig3,OUTPUT);
  pinMode(echo3,INPUT);
  pinMode(trig4,OUTPUT);
  pinMode(echo4,INPUT);
  pinMode(trig5,OUTPUT);
  pinMode(echo5,INPUT);
  pinMode(trig6,OUTPUT);
  pinMode(echo6,INPUT);
}

void loop() {

  //carro 4 -1
  estado=0;
  distancia(trig4,echo4);
  distancia1=distancia_cm;
  estado_vehiculo(distancia1);
  estado1=estado;
  Serial.print("Estado1:");
  Serial.println(estado1);

  //carro 5 -2
  estado=0;
  distancia(trig5,echo5);
  distancia2=distancia_cm;
  estado_vehiculo(distancia2);
  estado2=estado;
  Serial.print("Estado2:");
  Serial.println(estado2);

  //carro 6-3
  estado=0;
  distancia(trig6,echo6);
  distancia3=distancia_cm;
  estado_vehiculo(distancia3);
  estado3=estado;
  Serial.print("Estado3:");
  Serial.println(estado3);
  delay(1000);

  //carro 1 -4
  estado=0;
  distancia(trig1,echo1);
  distancia4=distancia_cm;
  estado_vehiculo(distancia4);
  estado4=estado;
  Serial.print("Estado4:");
  Serial.println(estado4);

  //carro 2 -5
  estado=0;
  distancia(trig2,echo2);
  distancia5=distancia_cm;
  estado_vehiculo(distancia5);
  estado5=estado;
  Serial.print("Estado5:");
  Serial.println(estado5);

  //carro 3 -6
  estado=0;
  distancia(trig3,echo3);
  distancia6=distancia_cm;
  estado_vehiculo(distancia6);
  estado6=estado;
  Serial.print("Estado6:");
  Serial.println(estado6);

}

float distancia(int trig, int echo)
{
digitalWrite(trig,0);
delayMicroseconds(4);
digitalWrite(trig,1);
delayMicroseconds(10);
digitalWrite(trig,0);
duracion=pulseIn(echo,1);
duracion=duracion/2;
distancia_cm=duracion/29;
return distancia_cm;
}
int estado_vehiculo(float medicion)
{
  if (medicion <= 4.5 && medicion >= 1)
  {
    estado = 1;
  }
  if (medicion > 4.5)
  {
    estado = 0;
  }
  return estado;
}
