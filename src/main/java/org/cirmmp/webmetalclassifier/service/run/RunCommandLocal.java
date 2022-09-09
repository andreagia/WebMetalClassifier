package org.cirmmp.webmetalclassifier.service.run;






import org.cirmmp.webmetalclassifier.model.Job;
import org.cirmmp.webmetalclassifier.model.OutRunCommnad;

import java.util.concurrent.CompletableFuture;

public interface RunCommandLocal {
   OutRunCommnad runjob(Job job) throws Exception;
}
