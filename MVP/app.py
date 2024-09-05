from flask import Flask, request, jsonify
import psycopg2

app = Flask(__name__)

# Connect to the PostgreSQL database
def get_db_connection():
    conn = psycopg2.connect(host='localhost', database='anime_match', user='youruser', password='yourpassword')
    return conn

# Get anime recommendations based on personality traits
@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    personality_traits = request.args.get('personality_traits')
    # You would typically call an external API here to get recommendations
    # For now, we'll mock the response
    recommendations = [
        {'title': 'Naruto'},
        {'title': 'Attack on Titan'},
        {'title': 'My Hero Academia'}
    ]
    return jsonify(recommendations)

# Register new user
@app.route('/api/user', methods=['POST'])
def register_user():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO users (username, email, password, personality_traits) VALUES (%s, %s, %s, %s)",
                (data['username'], data['email'], data['password'], data['personality_traits']))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'User registered successfully'})

# Get list of personality traits
@app.route('/api/personality_traits', methods=['GET'])
def get_personality_traits():
    traits = ['Optimistic', 'Pessimistic', 'Introverted', 'Extroverted']  # Example traits
    return jsonify({'traits': traits})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
