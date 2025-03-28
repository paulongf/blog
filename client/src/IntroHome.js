export default function IntroHome(){
    return(
       <div className="container intro-container">
        <div className="intro-wrapper">
        <div className="texts-intro">
        <h1 className="title-home">PALMEIRAS PORTO</h1>
        <h4 className="subtitle-home">Transformando a lealdade em padrão.</h4>
        <p className="text-home"><span style={{ fontSize: '2em', fontWeight: 'bold' }}>M</span>issão:
                     o objetivo do Palmeiras Porto é conseguir reunir
                    cada vez mais palmeirenses em nossa cidade
                    para fazermos amizades, torcermos juntos e
                    acima de tudo acompanhar o Palmeiras onde
                    quer que esteja</p>
        </div>
        <img className="big-logo" src="logo-palmeiras.jpg"/>
        </div>
       </div>
    )
}