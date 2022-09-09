package org.cirmmp.webmetalclassifier.service.run;

import org.cirmmp.webmetalclassifier.model.OutRunCommnad;

import java.io.File;
import java.util.List;
import java.util.Map;

public interface RunCommand {
    public OutRunCommnad run(List<String> cmdexe, Map<String, String> envl, File dir);
}
