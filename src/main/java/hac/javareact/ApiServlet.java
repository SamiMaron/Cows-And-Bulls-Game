package hac.javareact;

import com.google.gson.Gson;
import java.io.*;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.util.Collections;

@WebServlet(name = "ServletApi", value = "/api/highscores")
public class ApiServlet extends HttpServlet {
    /**
     *
     * @param request
     * @param response
     * @throws IOException
     */

    private static final String SCORES = "scores.dat"; // the path of the file that will contain the scores
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        try {
            List<Score> scores = loadScores();
            Collections.sort(scores);

            // to get the top 5 scores
            List<Score> topScores = scores.subList(0,Math.min(5, scores.size()));
            String json = gson.toJson(topScores);


            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to load high scores.");
        }

    }

    /**
     *
     * @param request
     * @param response
     * @throws IOException
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

        try {
            BufferedReader reader = request.getReader();
            String json = reader.readLine();
            Score newScore = gson.fromJson(json , Score.class);
            List<Score> scores = loadScores();
            boolean userExists = false;

            for(Score score : scores){
                if(score.getUserName().equals(newScore.getUserName())){
                    userExists = true ;
                    // submitting the best score
                    if(newScore.getScore() < score.getScore()){
                        score.setScore(newScore.getScore());
                    }
                    break;
                }
            }
            // if the user are not exists add the score that submitetd
            if(!userExists){
                scores.add(newScore);
            }

            saveScores(scores);
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to save score.");
        }
    }

    // function for loading the scores from the file
    private synchronized List<Score> loadScores() throws IOException{
        List<Score> scores;
        File file = new File(getServletContext().getRealPath(SCORES));
        if (!file.exists()) {
            boolean created = file.createNewFile();
            if (!created) {
                throw new IOException("Failed to create new file: " + file.getAbsolutePath());
            }
            scores = new ArrayList<>();
        } else {
            if (file.length() == 0) { // check if the file is empty
                scores = new ArrayList<>(); // initialize an empty list
            }
        else {
                try (FileInputStream fis = new FileInputStream(file);
                     BufferedInputStream bis = new BufferedInputStream(fis);
                     ObjectInputStream ois = new ObjectInputStream(bis)) {
                    scores = (List<Score>) ois.readObject();
                } catch (ClassNotFoundException e) {
                    throw new IOException("Failed to read scores.", e);
                }
            }

        }
        return scores;
    }

    // this function saving score to the file
    private synchronized void saveScores(List<Score> scores ) throws IOException{
        File file = new File(getServletContext().getRealPath(SCORES));
        try(ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(file))){
            oos.writeObject(scores);
        }
    }

    @Override
    public void init() {
    }

    @Override
    public void destroy() {
    }
}

