from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os
import re
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Directory configuration
CSV_DIR = 'press_releases'
OUTPUT_JSON = 'src/data/combined_press_releases.json'

def parse_khmer_date(date_str):
    """
    Convert Khmer date string to ISO format (YYYY-MM-DD)
    Handles both Khmer numerals (០-៩) and Arabic numerals (0-9)
    Example input: "ថ្ងៃទី១១ ខែមេសា ២០២៥" or "ថ្ងៃទី11 ខែមេសា 2025"
    Example output: "2025-04-11"
    """
    if not isinstance(date_str, str) or not date_str.strip():
        return None
    
    # Khmer month mapping
    khmer_months = {
        'មករា': 1, 'កុម្ភៈ': 2, 'មីនា': 3, 'មេសា': 4,
        'ឧសភា': 5, 'មិថុនា': 6, 'កក្កដា': 7, 'សីហា': 8,
        'កញ្ញា': 9, 'តុលា': 10, 'វិច្ឆិកា': 11, 'ធ្នូ': 12
    }
    
    # Khmer numeral to Arabic numeral mapping
    khmer_to_arabic = {
        '០': '0', '១': '1', '២': '2', '៣': '3', '៤': '4',
        '៥': '5', '៦': '6', '៧': '7', '៨': '8', '៩': '9'
    }
    
    try:
        # Improved regex pattern to match Khmer or Arabic numerals
        match = re.search(r'ថ្ងៃទី([០-៩0-9]+) ខែ([\w]+) ([០-៩0-9]+)', date_str)
        if not match:
            return None
            
        # Convert Khmer numerals to Arabic numerals if needed
        day = ''.join([khmer_to_arabic.get(c, c) for c in match.group(1)])
        day = int(day)
        
        month_kh = match.group(2)
        year = ''.join([khmer_to_arabic.get(c, c) for c in match.group(3)])
        year = int(year)
        
        month = khmer_months.get(month_kh)
        if not month:
            return None
            
        return f"{year}-{month:02d}-{day:02d}"
    except Exception as e:
        print(f"Error parsing date '{date_str}': {str(e)}")
        return None

def process_dataframe(df, source, categories):
    """Process a single dataframe with common operations"""
    # Process date column
    if 'Date' in df.columns:
        df['date_iso'] = df['Date'].apply(parse_khmer_date)
        # Fallback to original date if parsing fails
        df['date_iso'] = df['date_iso'].combine_first(
            pd.to_datetime(df['Date'], errors='coerce').dt.strftime('%Y-%m-%d')
        )
        # Final fallback to today's date if all parsing fails
        df['date_iso'] = df['date_iso'].fillna(datetime.now().strftime('%Y-%m-%d'))
    
    # Add additional fields
    df['source'] = source
    df['category'] = categories.get(source, 'General')
    
    # Rename columns to match your React component
    df = df.rename(columns={
        'Title': 'title',
        'URL': 'url',
        'date_iso': 'date',
        'Image': 'link'
    })
    
    # Add empty fields that your component expects
    df['description'] = df['title']
    df['chineseFullContent'] = ''
    df['englishSummary'] = df['title'].str.slice(0, 60) + '...'
    df['chineseSummary'] = ''
    
    return df

def load_and_process_csv():
    """Load all CSVs, process them, and return combined data"""
    all_data = []
    categories = {
        'cdc': 'International Cooperation',
        'khmertimes': 'Regulations',
        'mef': 'Investment',
        'ppp': 'Major Infrastructure Projects'
    }
    
    # Create directory if it doesn't exist
    if not os.path.exists(CSV_DIR):
        os.makedirs(CSV_DIR)
        print(f"Created {CSV_DIR} directory. Please add your CSV files there.")
        return []
    
    for filename in os.listdir(CSV_DIR):
        if filename.endswith('.csv'):
            source = filename.split('_')[0]
            try:
                df = pd.read_csv(os.path.join(CSV_DIR, filename))
                processed_df = process_dataframe(df, source, categories)
                all_data.extend(processed_df.to_dict('records'))
            except Exception as e:
                print(f"Error processing {filename}: {str(e)}")
    
    return all_data

def save_to_json(data, filename):
    """Save data to a JSON file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Data successfully saved to {filename}")

@app.route('/api/articles', methods=['GET'])
def get_articles():
    articles = load_and_process_csv()
    return jsonify(articles)

def convert_csv_to_json():
    """Standalone function to convert CSVs to JSON file"""
    print("Starting CSV to JSON conversion...")
    data = load_and_process_csv()
    if data:
        save_to_json(data, OUTPUT_JSON)
        print(f"Successfully converted CSVs to {OUTPUT_JSON}")
    else:
        print("No data processed. Please check your CSV files.")
    return data

if __name__ == '__main__':
    # Convert CSVs to JSON file
    convert_csv_to_json()
    
    # Also run the Flask API
    print("Starting Flask API server...")
    app.run(debug=True, port=5001)