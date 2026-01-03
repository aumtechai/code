import sys
import os
from datetime import datetime
import json
from sqlmodel import Session, select

# Setup path to import backend
sys.path.append(os.path.join(os.getcwd(), 'backend'))

# Import Scraper and DB
from api.texas_analytics import TexasAccountabilityScraper
from app.auth import engine
from api.index import TexasReport

def seed_texas():
    print("Initializing Scraper...")
    scraper = TexasAccountabilityScraper()
    
    # Target: Angelo State University (ID: 2, Sector: universities, Type: 1)
    target = {
        "instId": "2",
        "name": "Angelo State University",
        "sector": "universities",
        "type_id": 1
    }
    
    print(f"Fetching data for {target['name']}...")
    data = scraper.fetch_college_metrics(target['instId'], target['sector'], target['type_id'])
    
    if "error" in data:
        print(f"Error scraping: {data['error']}")
        return

    print("Generating AI Insights...")
    insight = scraper.generate_insights(target['name'], data)
    
    print("Saving to Database...")
    with Session(engine) as session:
        # Check existing
        existing = session.exec(select(TexasReport).where(TexasReport.inst_id == target['instId'])).first()
        if existing:
            existing.data_json = json.dumps(data)
            existing.ai_insight = insight
            existing.last_updated = datetime.utcnow()
            session.add(existing)
        else:
            new_report = TexasReport(
                inst_id=target['instId'],
                name=target['name'],
                sector=target['sector'],
                data_json=json.dumps(data),
                ai_insight=insight
            )
            session.add(new_report)
        session.commit()
    
    print("✓ Successfully seeded Angelo State University.")

if __name__ == "__main__":
    seed_texas()
