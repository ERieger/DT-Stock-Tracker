from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/summary')
def summary():
  return render_template('summary.html')
  
if __name__ == "__main__":
  app.run(debug=True)