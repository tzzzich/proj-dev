import './sponsor-info.css'

export default function SponsorInfo () {
    return(
        <div className="sponsor-info-wrapper">
            <div className="sponsor-info">
                <div className='image-holder sponsor-image'>
                    <img src='./lang.jpeg' alt="Sponsor Banner" className="sponsor-banner" />
                </div>
                <a href="https://vk.com/ttydrus" ><h2>Check out our sposor!</h2></a>
                <div className="credits-wrapper">
                    <div className='credits'>
                        <p>Credits:</p>
                        <ul>
                            <li>Bazdyrev Alexander</li>
                            <li>Eliseev Yuri</li>
                            <li>Bakhman Vladimir</li>
                            <li>Bukharova Victoria</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}