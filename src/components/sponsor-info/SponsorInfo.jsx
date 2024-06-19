import './sponsor-info.css'

export default function SponsorInfo () {
    return(
        <div className="sponsor-info-wrapper">
            <div className="sponsor-info">
                <div className='image-holder sponsor-image'>
                    <img src='https://placehold.co/600x400' alt="Sponsor Banner" className="sponsor-banner" />
                </div>
                <h2>SUBSCRIBE TO CaXaP</h2>
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